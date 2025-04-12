import { Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
    number: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message, number } = contactData;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "796a812d-8e22-41bc-b79d-17e780629030", // Replace with your Web3Forms API key
          name,
          email,
          message,
          number,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Message sent successfully!", { autoClose: 3000 });
        setContactData({ name: "", email: "", message: "", number: "" }); // Reset form
      } else {
        toast.error("Failed to send message. Please try again.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        autoClose: 3000,
        error,
      });
    }
  };

  const inputStyle =
    "transition duration-300 hover:scale-105 hover:opacity-90 w-full p-3 bg-gray-900/80 text-white rounded-lg border border-purple-500/30 focus:outline-none focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/40";

  return (
    <div className="relative z-10">
      <div
        className="flex justify-center items-center px-5 sm:px-10"
        style={{ background: "transparent" }}
      >
        <div
          className="contact-card-form w-full sm:w-96 mt-[10rem] p-6 rounded-lg text-center transform hover:scale-[1.004] transition-transform duration-300"
          style={{
            zIndex: 1000,
            background: "rgba(0,0,0,0.15)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 15px rgba(138, 43, 226, 0.15)",
          }}
        >
          <h4 className="text-4xl font-bold text-gray-300 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
            Contact Us
          </h4>

          <form onSubmit={handleOnSubmit}>
            <input
              required
              className={`${inputStyle} mt-10`}
              type="text"
              name="name"
              placeholder="Your Name"
              value={contactData.name}
              onChange={handleChange}
            />

            <input
              required
              className={`${inputStyle} mt-4`}
              type="email"
              name="email"
              placeholder="Your Email"
              value={contactData.email}
              onChange={handleChange}
            />

            <input
              required
              className={`${inputStyle} mt-4`}
              type="tel"
              name="number"
              placeholder="Your Contact Number"
              value={contactData.number}
              onChange={handleChange}
            />

            <textarea
              className={`${inputStyle} min-h-[8rem] max-h-[16rem] mt-4`}
              name="message"
              placeholder="Your Message"
              rows="4"
              value={contactData.message}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="duration-300 hover:scale-105 w-full p-3 mt-4 text-gray-200 rounded-full transition-all bg-gradient-to-r from-purple-600/80 to-blue-500/80 hover:from-purple-500/90 hover:to-blue-400/90 border border-white/10"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      {/* Privacy Policy */}
      <div className="mt-2 flex justify-center">
        <div className="max-w-[22rem] relative">
          <p className="text-purple-200/70 pl-6 relative text-sm">
            <Lock
              color="#d8b4fe"
              size={16}
              className="absolute left-0 top-1/2 transform -translate-y-1/2"
            />
            We value your privacy and will not share your information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
