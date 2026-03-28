import React from "react";
import logo1 from '../assets/logo1.jpeg';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { IoPersonCircle } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiSplitCross } from "react-icons/gi";

function Nav() {
    const { userData } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [show, setShow] = React.useState(false);
    const [showHam, setShowHam] = React.useState(false);

    const handleLogOut = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
            dispatch(setUserData(null));
            console.log(result.data);
            toast.success("Logout Successfully");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div>
            <div className='w-full h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-[#00000047] z-10'>

                <div className="lg:w-[20%] w-[40%]">
                    <img src={logo1} alt="" className='w-[60px] rounded-[5px] border-2 border-white' />
                </div>

                <div className='w-[30%] lg:flex items-center justify-center gap-4 hidden'>

                    {!userData && (
                        <IoPersonCircle
                            className='w-[50px] h-[50px] fill-black cursor-pointer'
                            onClick={() => setShow(prev => !prev)}
                        />
                    )}

                    {userData && (
                        <div
                            className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer'
                            onClick={() => setShow(prev => !prev)}
                        >
                            {userData?.name?.slice(0, 1).toUpperCase()}
                        </div>
                    )}

                    {userData?.role === "educator" && (
                        <div className='px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] cursor-pointer'>
                            Dashboard
                        </div>
                    )}

                    {!userData ? (
                        <span
                            className='px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] cursor-pointer'
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    ) : (
                        <span
                            className='px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] cursor-pointer'
                            onClick={handleLogOut}
                        >
                            Logout
                        </span>
                    )}

                    {show && (
                        <div className='absolute top-[110px] right-[15%] flex flex-col gap-2 text-[16px] rounded-md bg-white px-[15px] py-[10px] border-2 border-black'>
                            <span className='bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600'>
                                Profile
                            </span>
                            <span className='bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600'>
                                My Courses
                            </span>
                        </div>
                    )}

                </div>

                <RxHamburgerMenu
                    className='w-[35px] h-[35px] lg:hidden text-black cursor-pointer'
                    onClick={() => setShowHam(prev => !prev)}
                />

                <div className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000000d6] flex items-center justify-center flex-col gap-5 z-10 lg:hidden transform transition-all duration-500 ease-in-out ${showHam ? "translate-x-0" : "-translate-x-full"
                    }`}>

                    <GiSplitCross
                        className='w-[35px] h-[35px] fill-white absolute top-5 right-[4%] cursor-pointer'
                        onClick={() => setShowHam(prev => !prev)}
                    />

                </div>
            </div>
        </div>
    );
}

export default Nav;