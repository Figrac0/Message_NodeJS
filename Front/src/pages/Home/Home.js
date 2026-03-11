import React from "react";
import { withRouter } from "react-router-dom";
import "./Home.css";

const Home = (props) => {
    const handleNavigate = () => {
        props.history.push("/feed");
    };

    return (
        <div className="home">
            {/* Фоновый градиент */}
            <div className="home__background"></div>

            {/* Главный контент */}
            <div className="home__content">
                <div className="home__header">
                    <h1 className="home__title">
                        <span className="title-line">Welcome to</span>
                        <span className="title-gradient">MessageNode</span>
                    </h1>
                    <p className="home__subtitle">
                        Where conversations come alive with stunning design and
                        seamless experience
                    </p>
                </div>

                {/* Сетка с карточками */}
                <div className="home__grid">
                    {/* Блок 1 - Чтение */}
                    <div className="grid-card card-1">
                        <div className="card__icon">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        </div>
                        <h3>Read & Discover</h3>
                        <p className="card__description">
                            Captivating stories from creative minds around the
                            world. Unique perspectives and heartfelt narratives
                            await you.
                        </p>

                        {/* Анимированные звезды - больше и выше */}
                        <div className="floating-stars">
                            <div className="star star-1"></div>
                            <div className="star star-2"></div>
                            <div className="star star-3"></div>
                            <div className="star star-4"></div>
                            <div className="star star-5"></div>
                            <div className="star star-6"></div>
                            <div className="star star-7"></div>
                            <div className="star star-8"></div>
                        </div>

                        <div className="card__stats">
                            <span>100+ stories</span>
                            <span>50+ authors</span>
                        </div>
                    </div>

                    {/* Блок 2 - Создание */}
                    <div className="grid-card card-2">
                        <div className="card__icon">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                        </div>
                        <h3>Create & Share</h3>
                        <p className="card__description">
                            Express your thoughts with our beautiful post editor
                        </p>
                    </div>

                    {/* Блок 3 - Редактирование */}
                    <div className="grid-card card-3">
                        <div className="card__icon">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                        </div>
                        <h3>Edit & Refine</h3>
                        <p className="card__description">
                            Perfect your content with intuitive tools
                        </p>
                        <div className="card__tools">
                            <span>✏️ Preview</span>
                            <span>📋 History</span>
                        </div>
                    </div>

                    {/* Блок 4 - Сообщество */}
                    <div className="grid-card card-4">
                        <div className="card__icon">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <h3>Join Community</h3>
                        <p className="card__description">
                            Connect with like-minded people and grow together
                        </p>

                        {/* Солнце и облака */}
                        <div className="floating-clouds">
                            <div className="sun"></div>
                            <div className="cloud cloud-1">
                                <div className="cloud-part"></div>
                                <div className="cloud-part"></div>
                                <div className="cloud-part"></div>
                            </div>
                            <div className="cloud cloud-2">
                                <div className="cloud-part"></div>
                                <div className="cloud-part"></div>
                                <div className="cloud-part"></div>
                            </div>
                            <div className="cloud cloud-3">
                                <div className="cloud-part"></div>
                                <div className="cloud-part"></div>
                                <div className="cloud-part"></div>
                            </div>
                            <div className="cloud cloud-4">
                                <div className="cloud-part"></div>
                                <div className="cloud-part"></div>
                                <div className="cloud-part"></div>
                            </div>
                            <div className="cloud cloud-5">
                                <div className="cloud-part"></div>
                                <div className="cloud-part"></div>
                                <div className="cloud-part"></div>
                            </div>
                        </div>

                        <div className="card__community">
                            <span>5k+ members</span>
                            <span>Active</span>
                            <span>Global</span>
                        </div>
                    </div>

                    {/* Блок 5 - Интерактивность */}
                    <div className="grid-card card-5">
                        <div className="card__icon">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                        </div>
                        <h3>Interactive</h3>
                        <p className="card__description">
                            Like, bookmark and share posts
                        </p>
                    </div>

                    {/* Блок 6 - Безопасность */}
                    <div className="grid-card card-6">
                        <div className="card__icon">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="11"
                                    rx="2"
                                    ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h3>Secure</h3>
                        <p className="card__description">
                            Enterprise-grade security
                        </p>
                        <div className="card__security">
                            <span>🔐 Encryption</span>
                            <span>🛡️ GDPR</span>
                            <span>⚡ 99.9% uptime</span>
                        </div>
                    </div>

                    <div className="grid-card card-center">
                        {/* Анимационные элементы */}
                        <div className="center-animation">
                            <div className="circle circle-1"></div>
                            <div className="circle circle-2"></div>
                            <div className="circle circle-3"></div>
                            <div className="circle circle-4"></div>

                            <div className="wave wave-1"></div>
                            <div className="wave wave-2"></div>

                            <div className="dot dot-1"></div>
                            <div className="dot dot-2"></div>
                            <div className="dot dot-3"></div>
                            <div className="dot dot-4"></div>
                            <div className="dot dot-5"></div>
                        </div>

                        {/* Центральный контент */}
                        <div className="center-content">
                            <span className="center-text">Start Your</span>
                            <span className="center-highlight">Journey</span>
                            <span className="center-text">Today</span>
                        </div>

                        <div className="center__badges">
                            <span>✨ Free forever</span>
                            <span>🚀 No credit card</span>
                        </div>
                    </div>
                </div>
                {/* Кнопка перехода */}
                <div className="home__cta">
                    <button className="cta-button" onClick={handleNavigate}>
                        <span>Explore Feed</span>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Футер */}
            <footer className="home__footer">
                <div className="footer__content">
                    <div className="footer__info">
                        <div className="footer__logo">MessageNode</div>
                        <p className="footer__description">
                            A modern platform for sharing ideas and connecting
                            with creative minds.
                        </p>
                    </div>

                    <div className="footer__links">
                        <div className="footer__column">
                            <h4>Product</h4>
                            <a href="/features">Features</a>
                            <a href="/pricing">Pricing</a>
                            <a href="/updates">Updates</a>
                        </div>

                        <div className="footer__column">
                            <h4>Company</h4>
                            <a href="/about">About</a>
                            <a href="/blog">Blog</a>
                            <a href="/careers">Careers</a>
                        </div>

                        <div className="footer__column">
                            <h4>Resources</h4>
                            <a href="/help">Help Center</a>
                            <a href="/docs">Documentation</a>
                            <a href="/status">Status</a>
                        </div>
                    </div>

                    <div className="footer__social">
                        <a
                            href="https://github.com/Figrac0/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="github-link">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span>GitHub</span>
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                            </svg>
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>&copy; 2026 MessageNode. All rights reserved.</p>
                    <div className="footer__legal">
                        <a href="/privacy">Privacy</a>
                        <a href="/terms">Terms</a>
                        <a href="/cookies">Cookies</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default withRouter(Home);
