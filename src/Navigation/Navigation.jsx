import JobSearch from "../Pages/JobSearch/JobSearch"
import UserProfile from "../Pages/UserProfile/UserProfile";
import DashBoard from "../Pages/DashBoard/DashBoard"
import JobSeekerResume from "../Pages/JobSeekerResume/JobSeekerResume";
import JobApplications from "../Pages/JobApplications/JobApplications"
import Courses from "../Pages/TraningCourses/TrainingCourses";
import PostJob from "../Pages/PostJob/PostJob";
import Candidate from "../Pages/Candidate/Candidate";
import CreateCourses from "../Pages/CreateCourses/CreateCourses";
import CourseEnrollments from "../Pages/CourseEnrollments/CourseEnrollements";
import { element } from "prop-types";

const route = [
    {
        name: 'JobSearch',
        path:'/JobSearch',
        element:<JobSearch/>

    },
    {
        name:'UserProfile',
        path:'/UserProfile',
        element:<UserProfile/>
    },
    {
        name:'JobSeekerResume',
        path: '/JobSeekerResume',
        element: <JobSeekerResume/>
    },
    {
        name:'JobApplications',
        path:'/JobApplications',
        element:<JobApplications/>

    },
    {
        name: 'Courses',
        path:'/Courses',
        element: <Courses/>

    },
    {
        name: 'PostJob',
        path:'/CreateJob',
        element: <PostJob/>
    },
    {
        name: 'Candidate',
        path:'/Candidate',
        element:<Candidate/>
    },
    {
        name: 'CreateCourses',
        path:'/CreateCourses',
        element:<CreateCourses/>
    },
    {
        name: 'CourseEnrollments',
        path:'/CourseEnrollments',
        element:<CourseEnrollments/>
    }


]
export default route;
