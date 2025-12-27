import JobSearch from "../Pages/JobSearch/JobSearch"
import UserProfile from "../Pages/UserProfile/UserProfile";
import DashBoard from "../Pages/DashBoard/DashBoard"
import JobSeekerResume from "../Pages/JobSeekerResume/JobSeekerResume";
import JobApplications from "../Pages/JobApplications/JobApplications"
import PostJob from "../Pages/PostJob/PostJob";
import Candidate from "../Pages/Candidate/Candidate";
import Register from "../Pages/Register/Register";
// Removed trainer course features
import Home from "../Pages/Home/Home";
import { element } from "prop-types";

const route = [
    {
        name:'Home',
        path:'/Home',
        element:<Home/>
    },
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
        name: 'Register',
        path:'/register',
        element:<Register/>
    },
    
]
export default route;
