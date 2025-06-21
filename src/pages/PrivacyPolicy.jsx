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
                {t('privacy.section1.title')}
              </h2>

              <h3 className="text-xl md:text-2xl font-semibold text-yellow-400 mb-3">{t('privacy.section1.subsection1.title')}</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li><strong className="text-yellow-400">{t('privacy.section1.subsection1.item1.title')}</strong> {t('privacy.section1.subsection1.item1.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section1.subsection1.item2.title')}</strong> {t('privacy.section1.subsection1.item2.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section1.subsection1.item3.title')}</strong> {t('privacy.section1.subsection1.item3.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section1.subsection1.item4.title')}</strong> {t('privacy.section1.subsection1.item4.description')}</li>
              </ul>

              <h3 className="text-xl md:text-2xl font-semibold text-yellow-400 mb-3">{t('privacy.section1.subsection2.title')}</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li><strong className="text-yellow-400">{t('privacy.section1.subsection2.item1.title')}</strong> {t('privacy.section1.subsection2.item1.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section1.subsection2.item2.title')}</strong> {t('privacy.section1.subsection2.item2.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section1.subsection2.item3.title')}</strong> {t('privacy.section1.subsection2.item3.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section1.subsection2.item4.title')}</strong> {t('privacy.section1.subsection2.item4.description')}</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                {t('privacy.section2.title')}
              </h2>
              <p className="text-gray-300 mb-4">{t('privacy.section2.description')}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li>{t('privacy.section2.item1')}</li>
                <li>{t('privacy.section2.item2')}</li>
                <li>{t('privacy.section2.item3')}</li>
                <li>{t('privacy.section2.item4')}</li>
                <li>{t('privacy.section2.item5')}</li>
                <li>{t('privacy.section2.item6')}</li>
                <li>{t('privacy.section2.item7')}</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                {t('privacy.section3.title')}
              </h2>
              <p className="text-gray-300 mb-4">{t('privacy.section3.description')}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li><strong className="text-yellow-400">{t('privacy.section3.item1.title')}</strong> {t('privacy.section3.item1.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section3.item2.title')}</strong> {t('privacy.section3.item2.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section3.item3.title')}</strong> {t('privacy.section3.item3.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section3.item4.title')}</strong> {t('privacy.section3.item4.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section3.item5.title')}</strong> {t('privacy.section3.item5.description')}</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                {t('privacy.section4.title')}
              </h2>
              <p className="text-gray-300 mb-4">{t('privacy.section4.description')}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li>{t('privacy.section4.item1')}</li>
                <li>{t('privacy.section4.item2')}</li>
                <li>{t('privacy.section4.item3')}</li>
                <li>{t('privacy.section4.item4')}</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                {t('privacy.section5.title')}
              </h2>
              <p className="text-gray-300 mb-4">{t('privacy.section5.description')}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li><strong className="text-yellow-400">{t('privacy.section5.item1.title')}</strong> {t('privacy.section5.item1.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section5.item2.title')}</strong> {t('privacy.section5.item2.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section5.item3.title')}</strong> {t('privacy.section5.item3.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section5.item4.title')}</strong> {t('privacy.section5.item4.description')}</li>
                <li><strong className="text-yellow-400">{t('privacy.section5.item5.title')}</strong> {t('privacy.section5.item5.description')}</li>
              </ul>
            </div>

            {/* Additional Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-orange-400 mb-3">{t('privacy.section6.title')}</h2>
                <p className="text-gray-300 text-sm md:text-base">
                  {t('privacy.section6.description')}
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-orange-400 mb-3">{t('privacy.section7.title')}</h2>
                <p className="text-gray-300 text-sm md:text-base">
                  {t('privacy.section7.description')}
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-orange-400 mb-3">{t('privacy.section8.title')}</h2>
                <p className="text-gray-300 text-sm md:text-base">
                  {t('privacy.section8.description')}
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-orange-400 mb-3">{t('privacy.section9.title')}</h2>
                <p className="text-gray-300 text-sm md:text-base">
                  {t('privacy.section9.description')}
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
