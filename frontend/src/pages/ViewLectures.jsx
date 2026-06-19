import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { FaArrowLeftLong } from "react-icons/fa6";

function ViewLectures() {

  const { courseId } = useParams()
  const { courseData } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)

  const selectedCourse = courseData?.find(
    (course) => course._id === courseId
  )

  const [creatorData, setCreatorData] = useState(null)

  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null
  )

  const navigate = useNavigate()
  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            serverUrl + "/api/course/getcreator",
            { userId: selectedCourse?.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
          console.log(result.data)
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };

    handleCreator();


  }, [selectedCourse]);

  return (
    <div className='min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6'>

      {/* left or top */}

      <div className='w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200'>

        <div className='mb-6'>

          <h2 className='text-2xl font-bold flex items-center justify-start gap-[20px] text-gray-800'><FaArrowLeftLong className=' text-black w-[22px] h-[22px] cursor-pointer' onClick={() => navigate("/")} />{selectedCourse?.title}
            {selectedCourse?.title}
          </h2>
          <div className="mt-2 flex gap-4 text-sm text-gray-500 font-medium">
            <span>Category: {selectedCourse?.category}</span>
            <span>Level: {selectedCourse?.level}</span>
          </div>

        </div>

      </div>

    </div>
  )
}

export default ViewLectures