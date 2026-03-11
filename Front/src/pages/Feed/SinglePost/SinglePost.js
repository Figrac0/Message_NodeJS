import React, { Component } from "react";
import { Link } from "react-router-dom";
import Image from "../../../components/Image/Image";
import "./SinglePost.css";

const API_URL = "https://message-node-back.onrender.com";

class SinglePost extends Component {
    state = {
        postId: "",
        title: "",
        author: "",
        date: "",
        image: "",
        content: "",
        loading: true,
        isLiked: false,
        likesCount: 156,
        isBookmarked: false,
        authorBio: "",
    };

    authorBios = [
        "Builds reliable interfaces and turns complex ideas into readable products.",
        "Enjoys shipping practical features with a sharp eye for detail and UX.",
        "Writes clean frontend code and likes making products feel effortless.",
        "Focuses on scalable app architecture and polished user-facing flows.",
        "Combines product thinking with engineering discipline to refine every release.",
        "Likes clear APIs, thoughtful design systems, and maintainable codebases.",
        "Works at the intersection of engineering quality and smooth user experience.",
        "Turns rough concepts into usable features with consistent visual craft.",
    ];

    getStorageKey = (postId) => `single-post:preferences:${postId}`;

    getHash = (value) =>
        value.split("").reduce((hash, char) => hash + char.charCodeAt(0), 0);

    getDefaultLikesCount = (postId) => 80 + (this.getHash(postId) % 241);

    getAuthorBio = (author, postId) => {
        const bioIndex =
            this.getHash(`${author}:${postId}`) % this.authorBios.length;

        return this.authorBios[bioIndex];
    };

    getStoredPreferences = (postId) => {
        try {
            const rawPreferences = localStorage.getItem(
                this.getStorageKey(postId),
            );

            if (!rawPreferences) {
                return null;
            }

            return JSON.parse(rawPreferences);
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    persistPreferences = (postId, preferences) => {
        localStorage.setItem(
            this.getStorageKey(postId),
            JSON.stringify(preferences),
        );
    };

    componentDidMount() {
        const postId = this.props.match.params.postId;
        const graphqlQuery = {
            query: `
                query FetchSinglePost($postId: ID!) {
                    post(id: $postId) {
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
                postId: postId,
            },
        };

        fetch(`${API_URL}/graphql`, {
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
                    throw new Error("Fetching post failed!");
                }

                const storedPreferences = this.getStoredPreferences(postId);
                const author = resData.data.post.creator.name;
                const isLiked = storedPreferences
                    ? storedPreferences.isLiked
                    : false;
                const isBookmarked = storedPreferences
                    ? storedPreferences.isBookmarked
                    : false;
                const likesCount =
                    storedPreferences &&
                    typeof storedPreferences.likesCount === "number"
                        ? storedPreferences.likesCount
                        : this.getDefaultLikesCount(postId);

                this.setState({
                    postId,
                    title: resData.data.post.title,
                    author,
                    image: `${API_URL}/${resData.data.post.imageUrl}`,
                    date: new Date(
                        resData.data.post.createdAt,
                    ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }),
                    content: resData.data.post.content,
                    isLiked,
                    isBookmarked,
                    likesCount,
                    authorBio: this.getAuthorBio(author, postId),
                    loading: false,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ loading: false });
            });
    }

    handleLike = () => {
        this.setState((prevState) => {
            const nextState = {
                isLiked: !prevState.isLiked,
                likesCount: prevState.isLiked
                    ? prevState.likesCount - 1
                    : prevState.likesCount + 1,
            };

            this.persistPreferences(prevState.postId, {
                isLiked: nextState.isLiked,
                isBookmarked: prevState.isBookmarked,
                likesCount: nextState.likesCount,
            });

            return nextState;
        });
    };

    handleBookmark = () => {
        this.setState((prevState) => {
            const nextState = {
                isBookmarked: !prevState.isBookmarked,
            };

            this.persistPreferences(prevState.postId, {
                isLiked: prevState.isLiked,
                isBookmarked: nextState.isBookmarked,
                likesCount: prevState.likesCount,
            });

            return nextState;
        });
    };

    handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: this.state.title,
                text: this.state.content.substring(0, 100) + "...",
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    render() {
        if (this.state.loading) {
            return (
                <div className="single-post__loader">
                    <div className="loader">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className="single-post__background">
                    <div className="wave wave1"></div>
                    <div className="wave wave2"></div>
                    <div className="wave wave3"></div>
                </div>

                <div className="single-post__nav">
                    <Link to="/feed" className="back-btn">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Feed
                    </Link>
                </div>

                <section className="single-post">
                    <div className="single-post__header">
                        <div className="single-post__meta">
                            <span className="single-post__author">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <circle
                                        cx="12"
                                        cy="7"
                                        r="4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                </svg>
                                {this.state.author}
                            </span>
                            <span className="single-post__date">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M3 10H21"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M8 2V6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M16 2V6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                </svg>
                                {this.state.date}
                            </span>
                        </div>
                        <h1 className="single-post__title">
                            {this.state.title}
                        </h1>
                    </div>

                    <div className="single-post__image-wrapper">
                        <div className="single-post__image-glow"></div>
                        <div className="single-post__image">
                            <Image contain imageUrl={this.state.image} />
                        </div>
                    </div>

                    <div className="single-post__content-wrapper">
                        <div className="single-post__content-quote"></div>
                        <p className="single-post__content">
                            {this.state.content}
                        </p>
                    </div>

                    <div className="single-post__actions">
                        <button
                            className={`action-btn ${
                                this.state.isLiked ? "liked" : ""
                            }`}
                            onClick={this.handleLike}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill={
                                    this.state.isLiked ? "currentColor" : "none"
                                }
                                stroke="currentColor"
                                strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <span>{this.state.likesCount}</span>
                        </button>

                        <button
                            className={`action-btn ${
                                this.state.isBookmarked ? "bookmarked" : ""
                            }`}
                            onClick={this.handleBookmark}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill={
                                    this.state.isBookmarked
                                        ? "currentColor"
                                        : "none"
                                }
                                stroke="currentColor"
                                strokeWidth="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                        </button>
                    </div>

                    <div className="single-post__author-bio">
                        <div className="author-avatar">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div className="author-info">
                            <h4>{this.state.author}</h4>
                            <p>{this.state.authorBio}</p>
                        </div>
                    </div>

                    <div className="single-post__footer">
                        <div className="single-post__share">
                            <span>Share this post</span>
                            <button
                                className="share-btn"
                                onClick={this.handleShare}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                    <polyline points="16 6 12 2 8 6" />
                                    <line x1="12" y1="2" x2="12" y2="15" />
                                </svg>
                                Share
                            </button>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}

export default SinglePost;
