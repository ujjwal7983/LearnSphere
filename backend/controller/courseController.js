import Course from "../model/courseModel.js"
import  uploadOnCloudinary  from "../config/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        const { title, category } = req.body
        if (!title || !category) {
            return res.status(400).json({ message: "Title and category are required" })
        }
        const course = await Course.create({
            title,
            category,
            creator: req.userId
        })
        res.status(201).json({ message: "Course created successfully", course })
    } catch (error) {
        res.status(500).json({ message: "Error creating course", error })
    }
}

export const getPublishedCourses =  async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
        if( !courses ){
            return res.status(404).json({ message: "No courses found" })
        }
        res.status(200).json({ message: "Course fetched successfully", courses })
    } catch (error) {
        res.status(500).json({ message: "failed to find isPublished courses", error })
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.userId
        const courses = await Course.find({ creator: userId })
        if( !courses ){
            return res.status(404).json({ message: "No course found" })
        }
        res.status(200).json({ message: "Course fetched successfully", courses })
    } catch (error) {
        res.status(500).json({ message: "failed to get creator courses", error })
    }
}

export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params
        const { title, subTitle, description, category, level, isPublished ,price } = req.body
        let thumbnail
        if (req.file) {
            thumbnail = await uploadOnCloudinary(req.file.path)
        }
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }
        const updateData = {title, subTitle, description, category, level, isPublished, price, thumbnail }

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true })
        res.status(200).json({ message: "Course updated successfully", course })

    } catch (error) {
        res.status(500).json({ message: "failed to update course", error })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }
        res.status(200).json({ message: "Course fetched successfully", course })
    } catch (error) {
        res.status(500).json({ message: "failed to get course by ID", error })
    }
}

export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }
        course = await Course.findByIdAndDelete(courseId, { new: true })
         return res.status(200).json({ message: "Course removed successfully", course })
    } catch (error) {
        res.status(500).json({ message: "failed to remove course", error })
    }
}