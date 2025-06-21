/* eslint-disable react/no-unescaped-entities */
import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield } from "lucide-react";
import BlurCard from "../components/common/BlurCard";
import { useTranslation } from "../hooks/useTranslation";
import "./PrivacyPolicy.css";

gsap.registerPlugin(ScrollTrigger);

function PrivacyPolicy() {
  const servicesRef = useRef(null);
  const [isTablet, setIsTablet] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { t } = useTranslation();

  // Check if device is tablet/small laptop
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
    };

    checkTablet();
    window.addEventListener("resize", checkTablet);
    return () => window.removeEventListener("resize", checkTablet);
  }, []);

  // Enhanced hover handlers
  const handleCardHover = (cardIndex, isEntering) => {
    if (isEntering) {
      setHoveredCard(cardIndex);
    } else {
      setHoveredCard(null);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(servicesRef.current.children).forEach((el, i) => {
        // Add gsap-ready class to enable GSAP-controlled styling
        el.classList.add("gsap-ready");

        const delay = i * 0.2;

        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            refreshPriority: 1,
          },
          opacity: 0,
          y: 30,
          duration: 1.2,
          delay,
          ease: "power2.out",
        });

        // Add subtle hover enhancement animation (same as WhyUs)
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl
          .to(
            el.querySelector("h1, h2"),
            {
              y: -2,
              duration: 0.3,
              ease: "power2.out",
            },
            0
          )
          .to(
            el.querySelectorAll("h3"),
            {
              y: -1,
              duration: 0.3,
              ease: "power2.out",
              stagger: 0.1,
            },
            0
          )
          .to(
            el.querySelectorAll("p"),
            {
              color: "rgba(255, 255, 255, 0.9)",
              duration: 0.3,
              ease: "power2.out",
            },
            0
          );

        // Store timeline reference for hover control
        el._hoverTimeline = hoverTl;
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="text-white pt-[90px] md:pt-[70px]">
      {/* Cards Container */}
      <div
        ref={servicesRef}
        className="max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-20 flex flex-col gap-6 md:gap-8"
      >
        {/* Header Card */}
        <BlurCard
          className={`mt-8 md:mt-12 lg:mt-16 snap-center min-w-[95vw] md:min-w-[85vw] lg:min-w-0 whyus-card ${
            isTablet ? "!min-h-[200px]" : ""
          } ${hoveredCard === 0 ? "hovered" : ""}`}
          onMouseEnter={() => handleCardHover(0, true)}
          onMouseLeave={() => handleCardHover(0, false)}
        >
          <div className="text-center">
            <Shield className="w-16 h-16 text-orange-400 mx-auto mb-6" />
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-600 mb-4"
              style={{ paddingBottom: isTablet ? "10px" : "15px" }}
            >
              {t('privacy.pageTitle')}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-4">
              {t('privacy.subtitle')}
            </p>
            <p className="text-sm text-gray-400">
              {t('privacy.effectiveDate')}
            </p>
          </div>
        </BlurCard>

        {/* Main Privacy Policy Content Card */}
        <BlurCard
          className={`snap-center min-w-[95vw] md:min-w-[85vw] lg:min-w-0 whyus-card ${
            isTablet ? "!min-h-[400px]" : ""
          } ${hoveredCard === 1 ? "hovered" : ""}`}
          onMouseEnter={() => handleCardHover(1, true)}
          onMouseLeave={() => handleCardHover(1, false)}
        >
          <div className="privacy-content space-y-8">

            {/* Introduction */}
            <div>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                {t('privacy.introduction')}
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                1. Information We Collect
              </h2>

              <h3 className="text-xl md:text-2xl font-semibold text-yellow-400 mb-3">1.1 Information You Provide</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li><strong className="text-yellow-400">Account Information:</strong> Username, email address, password, and profile information</li>
                <li><strong className="text-yellow-400">Game Data:</strong> Game progress, achievements, scores, and gameplay statistics</li>
                <li><strong className="text-yellow-400">Communication Data:</strong> Messages, feedback, and support requests</li>
                <li><strong className="text-yellow-400">Payment Information:</strong> Billing details for purchases (processed securely through third-party payment processors)</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-semibold text-yellow-400 mb-3">1.2 Information We Collect Automatically</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li><strong className="text-yellow-400">Device Information:</strong> Device type, operating system, unique device identifiers</li>
                <li><strong className="text-yellow-400">Usage Data:</strong> How you interact with our Services, features used, time spent</li>
                <li><strong className="text-yellow-400">Technical Data:</strong> IP address, browser type, connection information</li>
                <li><strong className="text-yellow-400">VR/AR Data:</strong> Motion tracking, spatial data, and interaction patterns (with your consent)</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-300 mb-4">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li>Provide, maintain, and improve our Services</li>
                <li>Process transactions and deliver purchased content</li>
                <li>Personalize your gaming experience</li>
                <li>Communicate with you about updates, support, and promotional offers</li>
                <li>Ensure fair play and prevent cheating or fraud</li>
                <li>Comply with legal obligations and protect our rights</li>
                <li>Develop new features and services</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                3. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-300 mb-4">We may share your information in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li><strong className="text-yellow-400">With Your Consent:</strong> When you explicitly agree to share information</li>
                <li><strong className="text-yellow-400">Service Providers:</strong> Third-party companies that help us operate our Services</li>
                <li><strong className="text-yellow-400">Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong className="text-yellow-400">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong className="text-yellow-400">Public Information:</strong> Leaderboards, achievements, and other publicly visible game data</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                4. Data Security
              </h2>
              <p className="text-gray-300 mb-4">We implement industry-standard security measures to protect your information, including:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication systems</li>
                <li>Secure data centers and infrastructure</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                5. Your Rights and Choices
              </h2>
              <p className="text-gray-300 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li><strong className="text-yellow-400">Access:</strong> Request a copy of your personal information</li>
                <li><strong className="text-yellow-400">Correct:</strong> Update or correct inaccurate information</li>
                <li><strong className="text-yellow-400">Delete:</strong> Request deletion of your personal information</li>
                <li><strong className="text-yellow-400">Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong className="text-yellow-400">Data Portability:</strong> Receive your data in a portable format</li>
              </ul>
            </div>

            {/* Additional Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-orange-400 mb-3">6. Children's Privacy</h2>
                <p className="text-gray-300 text-sm md:text-base">
                  Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-orange-400 mb-3">7. International Data Transfers</h2>
                <p className="text-gray-300 text-sm md:text-base">
                  Your information may be transferred to and processed in countries other than your own with appropriate safeguards in place.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-orange-400 mb-3">8. Cookies & Tracking</h2>
                <p className="text-gray-300 text-sm md:text-base">
                  We use cookies and similar technologies to enhance your experience and analyze usage patterns.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-orange-400 mb-3">9. Policy Changes</h2>
                <p className="text-gray-300 text-sm md:text-base">
                  We may update this Privacy Policy from time to time and will notify you of any material changes.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="text-center pt-8 border-t border-orange-400/30">
              <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4">{t('privacy.contactTitle')}</h2>
              <p className="text-gray-300 mb-6">
                {t('privacy.contactDescription')}
              </p>
              <div className="mb-6">
                <a
                  href="mailto:bh@blackholeinfiverse.com"
                  className="text-2xl font-bold text-orange-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  {t('privacy.contactEmail')}
                </a>
              </div>
              <p className="text-sm text-gray-400">
                <strong>{t('privacy.lastUpdated')}</strong>
              </p>
            </div>

          </div>
        </BlurCard>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
