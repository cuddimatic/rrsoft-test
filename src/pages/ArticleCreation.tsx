import React, { useState } from 'react';
import { validateArticle } from '../utils/validation';
import { Article } from '../types/Article'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from "../utils/apis";

const ArticleCreation: React.FC = () => {
  const [articleData, setArticleData] = useState<Article>({
    title: '',
    body: '',
    authorName: '',
    contactInfo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({}); // Error object
  const [loading, setLoading] = useState(false); 

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setArticleData({ ...articleData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateArticle(articleData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true); // Set loading state to true when submitting article

      try {
        const response = await fetch(`${baseURL}/posts`, {
          method: 'POST',
          body: JSON.stringify(articleData),
        });
        if (response.ok) {
          toast.success("Successful", {
            theme: "colored"
          });
          setArticleData({
            title: '',
            body: '',
            authorName: '',
            contactInfo: '',
          });
        } else {
          toast.error("Unsuccessful", {
            theme: "colored"
          });
        }
      } catch (error) {
        console.error('Error submitting article:', error);
      } finally {
        setLoading(false); // Set loading state to false when submission is complete
      }
    }
  };

  return (
    <div>
      <h1>Create Article</h1>
      <form onSubmit={handleSubmit}>
        <div className='form_flex'>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={articleData.title}
              onChange={handleChange}
              required
            />
            {errors.title && <p className="error">{errors.title}</p>}
          </div>
          <div>
            <label htmlFor="authorName">Author Name:</label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={articleData.authorName}
              onChange={handleChange}
              required
            />
            {errors.authorName && <p className="error">{errors.errorAuthorName}</p>}
          </div>
        </div>
        <div className='form_flex'>
          <label htmlFor="contactInfo">Contact Phone Number:</label>
          <input
            type="tel"
            id="contactInfo"
            name="contactInfo"
            value={articleData.contactInfo}
            onChange={handleChange}
            required
          />
          {errors.contactInfo && <p className="error">{errors.contactInfo}</p>}
        </div>
        <label htmlFor="body">Body:</label>
        <textarea
          id="body"
          name="body"
          rows={20}
          value={articleData.body}
          onChange={handleChange}
          required
        />
        {errors.body && <p className="error">{errors.body}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ArticleCreation;
