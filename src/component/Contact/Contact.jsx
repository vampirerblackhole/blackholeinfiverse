import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    message: '',
    number: '',
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
        setContactData({ name: '', email: '', message: '', number: '' }); // Reset form
      } else {
        toast.error("Failed to send message. Please try again.", { autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", { autoClose: 3000 });
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-900 p-5 sm:p-10 " style={{backgroundColor:"black",  zIndex:1000}}>
      <div className="w-full sm:w-96  p-6 rounded-lg shadow-xl text-center transform transition duration-300 hover:scale-105 hover:opacity-90" style={{  zIndex:1000}}>
        <h4 className="text-4xl font-bold text-gray-300 pb-6">Contact Us</h4>
        
        <form onSubmit={handleOnSubmit}>
          <input
            className="w-full p-3 mb-4 bg-gray-700 text-gray-300 rounded-lg border-2 border-gray-600 focus:outline-none focus:border-gray-400"
            type="text"
            name="name"
            placeholder="Your Name"
            value={contactData.name}
            onChange={handleChange}
          />
          
          <input
            className="w-full p-3 mb-4 bg-gray-700 text-gray-300 rounded-lg border-2 border-gray-600 focus:outline-none focus:border-gray-400"
            type="email"
            name="email"
            placeholder="Your Email"
            value={contactData.email}
            onChange={handleChange}
          />

          <input
            className="w-full p-3 mb-4 bg-gray-700 text-gray-300 rounded-lg border-2 border-gray-600 focus:outline-none focus:border-gray-400"
            type="tel"
            name="number"
            placeholder="Your Contact Number"
            value={contactData.number}
            onChange={handleChange}
          />

          <textarea
            className="w-full p-3 mb-4 bg-gray-700 text-gray-300 rounded-lg border-2 border-gray-600 focus:outline-none focus:border-gray-400"
            name="message"
            placeholder="Your Message"
            rows="4"
            value={contactData.message}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full p-3 mb-4 bg-gray-600 text-gray-200 rounded-full border-2 border-gray-500 hover:bg-gray-500 transition-all duration-300"
          >
            Send Message
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            We value your privacy and will not share your information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
