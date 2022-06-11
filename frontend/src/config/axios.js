import axios from 'axios';

const token = localStorage.getItem("token");
export const axiosClient = axios.create({
    baseURL : `http://localhost:5000/api/`,
    headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`
    },
});
// console.log(axiosClient)
// axiosClient.intercepotors.response.use(
//     error => {
//       if (error.response.status === 401) {
//         window.location.href = '/';
//       }
// });

// export default customAxios;
