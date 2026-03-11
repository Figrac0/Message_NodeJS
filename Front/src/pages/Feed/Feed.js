import React, { Component, Fragment } from "react";
import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import "./Feed.css";

class Feed extends Component {
    state = {
        isEditing: false,
        posts: [],
        totalPosts: 0,
        editPost: null,
        status: "",
        postPage: 1,
        postsLoading: true,
        editLoading: false,
    };

    componentDidMount() {
        const graphqlQuery = {
            query: `
        {
          user {
            status
          }
        }
      `,
        };
        fetch("https://message-node-back.onrender.com/graphql", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + this.props.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
        })
            .then((res) => {
                return res.json();
            })
            .then((resData) => {
                if (resData.errors) {
                    throw new Error("Fetching status failed!");
                }
                this.setState({ status: resData.data.user.status });
            })
            .catch(this.catchError);

        this.loadPosts();
    }

    loadPosts = (direction) => {
        if (direction) {
            this.setState({ postsLoading: true, posts: [] });
        }
        let page = this.state.postPage;
        if (direction === "next") {
            page++;
            this.setState({ postPage: page });
        }
        if (direction === "previous") {
            page--;
            this.setState({ postPage: page });
        }
        const graphqlQuery = {
            query: `
        query FetchPosts($page: Int) {
          posts(page: $page) {
            posts {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
            totalPosts
          }
        }
      `,
            variables: {
                page: page,
            },
        };
        fetch("https://message-node-back.onrender.com/graphql", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + this.props.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
        })
            .then((res) => {
                return res.json();
            })
            .then((resData) => {
                if (resData.errors) {
                    throw new Error("Fetching posts failed!");
                }
                this.setState({
                    posts: resData.data.posts.posts.map((post) => {
                        return {
                            ...post,
                            imagePath: post.imageUrl,
                        };
                    }),
                    totalPosts: resData.data.posts.totalPosts,
                    postsLoading: false,
                });
            })
            .catch(this.catchError);
    };

    statusUpdateHandler = (event) => {
        event.preventDefault();
        const graphqlQuery = {
            query: `
        mutation UpdateUserStatus($userStatus: String!) {
          updateStatus(status: $userStatus) {
            status
          }
        }
      `,
            variables: {
                userStatus: this.state.status,
            },
        };
        fetch("https://message-node-back.onrender.com/graphql", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + this.props.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
        })
            .then((res) => {
                return res.json();
            })
            .then((resData) => {
                if (resData.errors) {
                    throw new Error("Fetching posts failed!");
                }
                console.log(resData);
            })
            .catch(this.catchError);
    };

    newPostHandler = () => {
        this.setState({ isEditing: true });
    };

    startEditPostHandler = (postId) => {
        this.setState((prevState) => {
            const loadedPost = {
                ...prevState.posts.find((p) => p._id === postId),
            };

            return {
                isEditing: true,
                editPost: loadedPost,
            };
        });
    };

    cancelEditHandler = () => {
        this.setState({ isEditing: false, editPost: null });
    };

    finishEditHandler = (postData) => {
        this.setState({
            editLoading: true,
        });
        const formData = new FormData();
        formData.append("image", postData.image);
        if (this.state.editPost) {
            formData.append("oldPath", this.state.editPost.imagePath);
        }
        fetch("https://message-node-back.onrender.com/post-image", {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + this.props.token,
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((fileResData) => {
                const imageUrl = fileResData.filePath || "undefined";
                let graphqlQuery = {
                    query: `
          mutation CreateNewPost($title: String!, $content: String!, $imageUrl: String!) {
            createPost(postInput: {title: $title, content: $content, imageUrl: $imageUrl}) {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
          }
        `,
                    variables: {
                        title: postData.title,
                        content: postData.content,
                        imageUrl: imageUrl,
                    },
                };

                if (this.state.editPost) {
                    graphqlQuery = {
                        query: `
              mutation UpdateExistingPost($postId: ID!, $title: String!, $content: String!, $imageUrl: String!) {
                updatePost(id: $postId, postInput: {title: $title, content: $content, imageUrl: $imageUrl}) {
                  _id
                  title
                  content
                  imageUrl
                  creator {
                    name
                  }
                  createdAt
                }
              }
            `,
                        variables: {
                            postId: this.state.editPost._id,
                            title: postData.title,
                            content: postData.content,
                            imageUrl: imageUrl,
                        },
                    };
                }

                return fetch("https://message-node-back.onrender.com/graphql", {
                    method: "POST",
                    body: JSON.stringify(graphqlQuery),
                    headers: {
                        Authorization: "Bearer " + this.props.token,
                        "Content-Type": "application/json",
                    },
                });
            })
            .then((res) => {
                return res.json();
            })
            .then((resData) => {
                if (resData.errors && resData.errors[0].status === 422) {
                    throw new Error(
                        "Validation failed. Make sure the email address isn't used yet!",
                    );
                }
                if (resData.errors) {
                    throw new Error("User login failed!");
                }
                let resDataField = "createPost";
                if (this.state.editPost) {
                    resDataField = "updatePost";
                }
                const post = {
                    _id: resData.data[resDataField]._id,
                    title: resData.data[resDataField].title,
                    content: resData.data[resDataField].content,
                    creator: resData.data[resDataField].creator,
                    createdAt: resData.data[resDataField].createdAt,
                    imagePath: resData.data[resDataField].imageUrl,
                };
                this.setState((prevState) => {
                    let updatedPosts = [...prevState.posts];
                    let updatedTotalPosts = prevState.totalPosts;
                    if (prevState.editPost) {
                        const postIndex = prevState.posts.findIndex(
                            (p) => p._id === prevState.editPost._id,
                        );
                        updatedPosts[postIndex] = post;
                    } else {
                        updatedTotalPosts++;
                        if (prevState.posts.length >= 2) {
                            updatedPosts.pop();
                        }
                        updatedPosts.unshift(post);
                    }
                    return {
                        posts: updatedPosts,
                        isEditing: false,
                        editPost: null,
                        editLoading: false,
                        totalPosts: updatedTotalPosts,
                    };
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    isEditing: false,
                    editPost: null,
                    editLoading: false,
                    error: err,
                });
            });
    };

    statusInputChangeHandler = (input, value) => {
        this.setState({ status: value });
    };

    deletePostHandler = (postId) => {
        this.setState({ postsLoading: true });
        const graphqlQuery = {
            query: `
        mutation {
          deletePost(id: "${postId}")
        }
      `,
        };
        fetch("https://message-node-back.onrender.com/graphql", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + this.props.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
        })
            .then((res) => {
                return res.json();
            })
            .then((resData) => {
                if (resData.errors) {
                    throw new Error("Deleting the post failed!");
                }
                console.log(resData);
                this.loadPosts();
            })
            .catch((err) => {
                console.log(err);
                this.setState({ postsLoading: false });
            });
    };

    errorHandler = () => {
        this.setState({ error: null });
    };

    catchError = (error) => {
        this.setState({ error: error });
    };

    render() {
        return (
            <Fragment>
                <ErrorHandler
                    error={this.state.error}
                    onHandle={this.errorHandler}
                />
                <FeedEdit
                    editing={this.state.isEditing}
                    selectedPost={this.state.editPost}
                    loading={this.state.editLoading}
                    onCancelEdit={this.cancelEditHandler}
                    onFinishEdit={this.finishEditHandler}
                />

                <div className="feed__container">
                    <div className="feed__header">
                        <h1 className="feed__title">Your Feed</h1>
                        <p className="feed__subtitle">
                            Discover amazing content from the community
                        </p>
                    </div>

                    <div className="feed__stats">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">
                                    {this.state.totalPosts}
                                </span>
                                <span className="stat-label">Total Posts</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 8v8"></path>
                                    <path d="M8 12h8"></path>
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">
                                    {this.state.posts.length}
                                </span>
                                <span className="stat-label">On This Page</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                                    <line
                                        x1="2"
                                        y1="20"
                                        x2="2.01"
                                        y2="20"></line>
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">
                                    {Math.ceil(this.state.totalPosts / 2)}
                                </span>
                                <span className="stat-label">Total Pages</span>
                            </div>
                        </div>
                    </div>

                    <div className="feed__features">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                </svg>
                            </div>
                            <div className="feature-content">
                                <h3>Read</h3>
                                <p>
                                    Discover amazing stories and insights from
                                    the community
                                </p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                            </div>
                            <div className="feature-content">
                                <h3>Create</h3>
                                <p>
                                    Share your thoughts and experiences with the
                                    world
                                </p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </div>
                            <div className="feature-content">
                                <h3>Edit</h3>
                                <p>Refine and update your posts anytime</p>
                            </div>
                        </div>
                    </div>

                    <div className="feed__status-card">
                        <div className="status-header">
                            <div className="status-avatar">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <span className="status-title">Your Status</span>
                        </div>
                        <form
                            onSubmit={this.statusUpdateHandler}
                            className="status-form">
                            <Input
                                type="text"
                                placeholder="What's on your mind?"
                                control="input"
                                onChange={this.statusInputChangeHandler}
                                value={this.state.status}
                            />
                            <Button
                                mode="flat"
                                type="submit"
                                className="status-update-btn">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                                Update
                            </Button>
                        </form>
                    </div>

                    <div className="feed__action">
                        <button
                            className="new-post-btn"
                            onClick={this.newPostHandler}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                            <span>Create New Post</span>
                        </button>
                    </div>

                    <section className="feed__posts">
                        {this.state.postsLoading && (
                            <div className="feed__loader">
                                <Loader />
                            </div>
                        )}

                        {!this.state.postsLoading &&
                            this.state.posts.length > 0 && (
                                <Paginator
                                    onPrevious={this.loadPosts.bind(
                                        this,
                                        "previous",
                                    )}
                                    onNext={this.loadPosts.bind(this, "next")}
                                    lastPage={Math.ceil(
                                        this.state.totalPosts / 2,
                                    )}
                                    currentPage={this.state.postPage}>
                                    <div className="posts-grid">
                                        {this.state.posts.map((post) => (
                                            <Post
                                                key={post._id}
                                                id={post._id}
                                                author={post.creator.name}
                                                date={new Date(
                                                    post.createdAt,
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                                title={post.title}
                                                image={post.imageUrl}
                                                content={post.content}
                                                onStartEdit={this.startEditPostHandler.bind(
                                                    this,
                                                    post._id,
                                                )}
                                                onDelete={this.deletePostHandler.bind(
                                                    this,
                                                    post._id,
                                                )}
                                            />
                                        ))}
                                    </div>
                                </Paginator>
                            )}

                        {this.state.posts.length <= 0 &&
                            !this.state.postsLoading && (
                                <div className="feed__empty">
                                    <div className="empty-illustration">
                                        <svg
                                            width="120"
                                            height="120"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1">
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="2"></rect>
                                            <path d="M9 9h6v6H9z"></path>
                                            <path d="M15 9l6-6"></path>
                                            <path d="M9 15l-6 6"></path>
                                        </svg>
                                    </div>
                                    <h3>No posts yet</h3>
                                    <p>
                                        Be the first to share something amazing!
                                    </p>
                                    <button
                                        className="empty-create-btn"
                                        onClick={this.newPostHandler}>
                                        Create Your First Post
                                    </button>
                                </div>
                            )}
                    </section>
                </div>
            </Fragment>
        );
    }
}

export default Feed;
