import mongoose from "mongoose";
import Review from "../model/reviewModel.js";
import Course from "../model/courseModel.js";

export const createReview = async (req, res) => {
  try {
    
    const { rating, comment ,courseId} = req.body;
    const userId = req.userId; 
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    
    const alreadyReviewed = await Review.findOne({ course: courseId, user: userId });
    if (alreadyReviewed) return res.status(400).json({ message: "You have already reviewed this course" });

    const review = new Review({
      course: courseId,
      user: userId,
      rating,
      comment
    });

    await review.save();

    course.reviews.push(review._id);
    await course.save();

    return res.status(201).json(review);
  } catch (error) {
    console.error("Add Review Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// export const getCourseReviews = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const reviews = await Review.find({ course: courseId })
//     return res.status(200).json(reviews);
//   } catch (error) {
//     return res.status(500).json({ message: "Error fetching reviews" });
//   }
// };


export const getReviews = async (req, res) => {
  try {
    // Pagination is opt-in via ?page=&limit= — without these params the
    // response shape (a plain array) stays exactly as before.
    const { page, limit } = req.query;

    if (!page) {
      const reviews = await Review.find({})
        .populate("user course")
        .sort({ reviewedAt: -1 });
      return res.status(200).json(reviews);
    }

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.max(parseInt(limit) || 10, 1);

    const [reviews, total] = await Promise.all([
      Review.find({})
        .populate("user course")
        .sort({ reviewedAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Review.countDocuments({})
    ]);

    res.setHeader("X-Total-Count", total);
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// Aggregates rating stats (average + count + breakdown by star) for a single
// course using MongoDB's aggregation pipeline.
export const getCourseRatingSummary = async (req, res) => {
  try {
    const { courseId } = req.params;

    const summary = await Review.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: "$course",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingBreakdown: { $push: "$rating" }
        }
      }
    ]);

    if (summary.length === 0) {
      return res.status(200).json({ averageRating: 0, totalReviews: 0, ratingBreakdown: [] });
    }

    const { averageRating, totalReviews, ratingBreakdown } = summary[0];
    const breakdownCounts = [1, 2, 3, 4, 5].reduce((acc, star) => {
      acc[star] = ratingBreakdown.filter((r) => r === star).length;
      return acc;
    }, {});

    return res.status(200).json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingBreakdown: breakdownCounts
    });
  } catch (error) {
    console.error("Error computing rating summary:", error);
    return res.status(500).json({ message: "Failed to compute rating summary" });
  }
};
