import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          
          {/* User Information */}
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>

          <div className="info">
            <span>
              Avatar:
              <img src={currentUser?.avatar || "/noavatar.jpg"} alt="User Avatar" />
            </span>
            <span>
              Username: <b>{currentUser?.username}</b>
            </span>
            <span>
              Email: <b>{currentUser?.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {/* My Posts Section */}
          <div className="title">
            <h1>My Listings</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>
          <Suspense fallback={<p>Loading your listings...</p>}>
            <Await resolve={data.postResponse} errorElement={<p>Error loading posts!</p>}>
              {(postResponse) => 
                postResponse?.data?.userPosts?.length > 0 ? (
                  <List posts={postResponse.data.userPosts} />
                ) : (
                  <p>You haven't created any listings yet.</p>
                )
              }
            </Await>
          </Suspense>

          {/* Saved Listings Section */}
          <div className="title">
            <h1>Saved Listings</h1>
          </div>
          <Suspense fallback={<p>Loading saved listings...</p>}>
            <Await resolve={data.postResponse} errorElement={<p>Error loading saved posts!</p>}>
              {(postResponse) => 
                postResponse?.data?.savedPosts?.length > 0 ? (
                  <List posts={postResponse.data.savedPosts} />
                ) : (
                  <p>You haven't saved any listings yet.</p>
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Chat Section */}
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading chats...</p>}>
            <Await resolve={data.chatResponse} errorElement={<p>Error loading chats!</p>}>
              {(chatResponse) => 
                chatResponse?.data?.length > 0 ? (
                  <Chat chats={chatResponse.data} />
                ) : (
                  <p>You have no active chats.</p>
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
