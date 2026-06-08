import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setCreatorCourseData } from '../redux/courseSlice'
import { useSelector } from 'react-redux'

const getCreatorCourse = () => {
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)
    return (
        useEffect(() => {
            const creatorCourses = async () => {
                try {
                    const result = await axios.get(serverUrl + "/api/course/getcreator", { withCredentials: true })
                    console.log(result.data)
                    dispatch(setCreatorCourseData(result.data.courses))
                } catch (error) {
                    console.error("Error fetching creator courses:", error)
                }
            }
            creatorCourses()
        }, [userData])
    )
}

export default getCreatorCourse