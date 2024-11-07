import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  // State to manage form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('Form Data Submitted:', formData);
    setFormData({
      name: "",
      email:"",
      message: ''
    });
    toast.success("Sent");

  };
  useEffect(() => {

  },[formData])

  return (
    <div className="min-h-screen flex items-center bg-gray-50 py-12 px-6">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-lg p-8 space-y-8 md:space-y-0">
        {/* Contact Form */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center md:text-left">Contact Us</h2>
          <p className="text-lg text-gray-700 text-center mb-8 md:text-left">
            We’d love to hear from you. Please fill out the form below and we’ll get back to you as soon as possible.
          </p>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                placeholder="Your Name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                placeholder="Your Email"
                required
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-800">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                placeholder="Your Message"
                rows="4"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </div>
          </form>

          {/* Additional Information below the form */}
          <div className="mt-6 text-center text-gray-600">
            <p className="text-sm">
              If you have any questions or need further assistance, feel free to reach out.
            </p>
            <p className="text-sm mt-2">
              Our team will respond within 1-2 business days. Thank you for contacting us!
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaHFX0p88Q01TZWFuaGqKuu3k4uw-jqx3mFw&s" // Replace with the actual image URL
            alt="nutrition"
            className="rounded-lg  w-full md:w-3/4 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
