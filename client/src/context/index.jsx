import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthUser, setAuthUser } from "../redux/slices/authUser";
import { clearAuthToken, setAuthToken } from "../redux/slices/authToken";


export const GlobalContext = createContext();

export default function GlobalState({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  // const [user,setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searhCalled, setSearhCalled] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [recipeDetailsData, setRecipeDetailsData] = useState(null);
  const [cookies] = useCookies(["access_token"]);
  const [recipesList, setRecipesList] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState(null);
  const [likedPosts, setLikedPosts] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0);
  const [searchPagination, setSearchPagination] = useState(1);
  const [searchPaginationTotal, setSearchPaginationTotal] = useState(0);
  const navigate = useNavigate();
  const [editableRecipe, setEditableRecipe] = useState({});
  const [editableImagePreview, setEditableImagePreview] = useState();
  const [searching, setSearching] = useState();
  const [hidePagination, setHidePagination] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const limit = 6; // Items per page
  const { token } = useSelector((store) => store.token);


  const createRecipe = async (newRecipeData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/recipes`, newRecipeData, { withCredentials: true });

      if (res.data.success) {
        toast.success("Created");
        fetchRecipes(page);
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast.error(error.response?.data?.message || "Error occurred while creating recipe");
    } finally {
      setLoading(false);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/recipes?search=${searchParam}`);
      if (res?.data?.recipes) {
        setRecipesList(res.data.recipes);
      }
      setLoading(false);
      setSearchParam("");
    } catch (error) {
      console.error("Error during search:", error);
      setLoading(false);
      setSearchParam("");
    }
  }

  const getEditableRecipe = async (recipeId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/recipes/getdetail/${recipeId}`,
        { withCredentials: true }
      );
      setEditableRecipe(response.data); // Set entire recipe object
      setEditableImagePreview(response.data.imageUrl || ""); // Update image preview
    } catch (error) {
      toast.error("Couldn't found food details")
      console.error("Error fetching recipe details:", error);
    } finally {
      setLoading(false);
    }
  };

  const editPost = async (recipeId, postData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/recipes/update-recipe/${recipeId}`,
        postData,
        { withCredentials: true }
      )
      if (res.data.success) {
        toast.success("Post updated");
        fetchRequired();
        navigate("/")
        setEditableRecipe();
      }
    } catch (error) {
      toast.error(error.res.data.message || "couldn't edit post")
    } finally {
      setLoading(false);
    }
  }

  const fetchRecipes = async (page) => {
    setLoading(true);
    try {
      // if(!page) page=1;
      const response = await axios.get(`${API_URL}/recipes`,
        {
          withCredentials: true,
          params: { page, limit },
        }
      );
      setRecipesList(response.data.recipes);
      setPage(response.data.page);
      setTotalPages(response.data.pages);

    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (recipeID) => {

    try {
      const res = await axios.get(`${API_URL}/recipes/${recipeID}`, { withCredentials: true });
      if (res.data.success) {
        // toast.success(res.data.message);
      }
      await fetchRequired();
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Couldn't save post!")
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/logout`);

      if (res.data.success) {
        dispatch(clearAuthUser());
        dispatch(clearAuthToken());
        setLikedPosts(null);
        setFavoriteRecipes(null);
        navigate("/login");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const onRegister = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          username: data.username.toLowerCase(),
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Registration Successful");
        navigate("/login");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.response?.data?.message || "Error occurred during registration";
      console.error("Registration Error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getfavouriteRecipes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/recipes/favorites`,
        {
          withCredentials: true
        });

      if (res.data.success) {
        setFavoriteRecipes(res.data?.savedRecipes);
      }
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
      toast.error("Failed to load recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAllLikedPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/recipes/likedposts`,
        { withCredentials: true });
      setLikedPosts(res.data?.likedPosts);
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId) => {

    try {
      const res = await axios.get(`${API_URL}/recipes/likepost/${postId}`, { withCredentials: true });
      if (res.data.success) {
        // toast.success(res.data.message);
        setLikedPosts(res.data.likedPosts);
      }
      await fetchRequired();

    } catch (error) {
      toast.error("Coundn't like post");
    }
  };

  const dislikePost = async (postId) => {

    try {
      const res = await axios.get(`${API_URL}/recipes/dislikepost/${postId}`, { withCredentials: true });
      if (res.data.success) {
        // toast.success(res.data.message);
        setLikedPosts(res.data.likedPosts);
      }
      await fetchRequired();
    } catch (error) {
      console.error("Error disliking post:", error.message);
      toast.error("Couldn't dislike");
    }
  };

  const handleSearch = async (searchText, searchPagination) => {
    if (!searchText && !searchText?.trim()) return;
    setSearching(true);
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/recipes/search/${encodeURIComponent(searchText)}`,
        {
          withCredentials: true,
          params: { searchPagination, limit },
        }
      );
      if (response.data.success) {
        setHidePagination(true);
        setSearchPagination(response.data.page);
        setSearchPaginationTotal(response.data.pages);
        setRecipesList(response.data.results);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setSearhCalled(true);
      setSearching(false);
    }
  }

  const deletePost = async (postId) => {

    try {
      const res = await axios.delete(`${API_URL}/recipes/deletepost/${postId}`,
        { withCredentials: true }
      );
      if (res?.data?.success) {
        toast.success(res.data.message);
        await fetchRequired();
      } else {
        toast.error(res?.data?.message)
      }
    } catch (error) {
      // console.log("error", error.message);
      toast.error(error.res.data.error);
    }
  }

  const init = async () => {
    // const token = await Cookies.get('access_token');
    if (user) {
      console.log("init user found")
      console.log("token", token);
      await fetchRequired();
    } else {
      console.log("init user not found")
      await fetchRecipes(page);
    }
  }

  const deleteProfilePicture = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`${API_URL}/auth/delete-profilepic`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAuthUser({ ...user, "profile_pic": null }));
        // sessionStorage.setItem('userDATA', JSON.stringify({ ...user, "profile_pic": null }));
      } else {
        toast.error(res.data.message);
      }
      await fetchRequired();
    } catch (error) {
      toast.error(error.res.data.message || "error occurred while delting profile pic");
    } finally {
      setLoading(false);
    }
  }

  const editProfilePicture = async (pic) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("pic", pic);  // Append the selected file to FormData

      const res = await axios.patch(
        `${API_URL}/auth/update-profilepic`, // Make sure this route matches your backend
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct header for file uploads
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAuthUser({ ...user, "profile_pic": res.data.user.profile_pic }));
        // sessionStorage.setItem('userDATA', JSON.stringify(res.data.user));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (data) => {
    setLoading(true);
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);
      if (data.pic && data.pic[0]) {
        formData.append("pic", data.pic[0]); // Append the file directly
      }

      // Send request with FormData
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`,
        formData, { withCredentials: true }
      );

      if (res.data.success) {
        const checkToken = await axios.get(`${API_URL}/auth/checkauth`, { withCredentials: true });
        if (!checkToken.data.success) {
          toast.info("Cookies has blocked by browser");
          dispatch(setAuthToken(res.data.token));
        }
        toast.success(res.data.message);
        dispatch(setAuthUser(res.data.user));
        await fetchRequired();
        navigate("/");
      }
    } catch (err) {
      console.error("Error during login:", err);
      toast.error(err.response.data.message || "Login failed"); // Use server message if available

    } finally {
      setLoading(false);
    }
  };

  const fetchRequired = async () => {
    await getAllLikedPosts();
    await getfavouriteRecipes();
    await fetchRecipes(page);
  }


  async function getRecipeDetails(recipeId) {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/recipes/getdetail/${recipeId}`);
      setRecipeDetailsData(response.data);

    } catch (error) {
      console.error("Error fetching recipe details:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("interceptor runned")
    // Axios interceptor to add Authorization header with the token for each request
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Clean up interceptor on component unmount
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]); // Re-run if token changes

  useEffect(() => {
    setLoading(true);
    console.log("init runned")
    init();
    setLoading(false);
  }, []);  // Run only once on mount



  return (
    <GlobalContext.Provider
      value={{
        setSearchResults,
        setHidePagination,
        hidePagination,
        getRecipeDetails,
        recipeDetailsData,
        onRegister,
        createRecipe,
        getEditableRecipe,
        editableRecipe,
        setEditableRecipe,
        editableImagePreview,
        setEditableImagePreview,
        editPost,

        getfavouriteRecipes,
        getAllLikedPosts,
        loading,
        searching,
        setSearching,
        searchPagination,
        searchPaginationTotal,
        setSearchPagination,

        setLoading,
        fetchRequired,
        onLogin,
        deleteProfilePicture,
        editProfilePicture,
        setRecipesList,

        handleSearch,
        searchResults,
        deletePost,
        page,
        setPage,
        totalPages,
        setTotalPages,
        limit,
        init,
        setSearhCalled,
        searhCalled,

        searchParam,
        setSearchParam,
        setRecipeDetailsData,
        recipesList,
        favoriteRecipes,
        setFavoriteRecipes,
        likedPosts,
        setLikedPosts,
        handleSubmit,
        fetchRecipes,
        addToFavorites,
        logout,
        likePost,
        dislikePost,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
