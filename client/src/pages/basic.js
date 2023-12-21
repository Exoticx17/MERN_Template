import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import '../stylesheets/basics.css'
import HeadPhoto from '../photos/yosemite.jpg'
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Basic() {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [newIdea, setNewIdea] = useState({ name: '', description: '', itags: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState([]);
  let userId = localStorage.getItem('userid')

  const [cookie,setCookie] = useCookies()
    const jwt = cookie.jwt
    useEffect(() => {
      if (!jwt) {
        window.location.assign('/login');
      }
    })

  useEffect(() => {
    // Fetch the list of ideas using the getIdeas API
    Axios.get('http://localhost:5000/idea/')
      .then((response) => {
        setIdeas(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleIdeaClick = (idea) => {
    if (selectedIdea && selectedIdea._id === idea._id) {
      setSelectedIdea(null);
    } else {
      setSelectedIdea(idea); // Set the selected idea first
      fetchUser(idea.user); // Fetch user data associated with the clicked idea
    }
  };
  
  const fetchUser = (iuser) => {
    if (!iuser) {
      console.error('Invalid user ID'); // Handle the case where the user ID is missing or invalid
      return;
    }
  
    Axios.get(`http://localhost:5000/user/one/${iuser}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onClick1 = () => {
    window.location.href = '/files';
  };

  const onClick2 = () => {
    window.location.href = '/voting';
  };
  const createIdea = () => {
    Axios.post(`http://localhost:5000/idea?userId=${userId}`, newIdea)
      .then((response) => {
        setIdeas([...ideas, response.data]);
        setNewIdea({ name: '', description: '', itags: [] });
        window.location.reload(); 
      })
      .catch((error) => {
        console.error(error);
      });
      Axios.patch(`http://localhost:5000/user/posted/${userId}`)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const editIdea = () => {
    Axios.patch(`http://localhost:5000/idea/edit?id=${selectedIdea._id}`, {
      name: selectedIdea.name,
      description: selectedIdea.description,
      itags: selectedIdea.itags,
    })
      .then((response) => {
        const updatedIdeas = ideas.map((item) => (item._id === response.data._id ? response.data : item));
        setIdeas(updatedIdeas);
        setSelectedIdea(null);
        window.location.reload(); 
      })
      .catch((error) => {
        console.error(error);
      });
  };
  

  const deleteIdea = () => {
    Axios.delete(`http://localhost:5000/idea/delete?id=${selectedIdea._id}`)
      .then(() => {
        const updatedIdeas = ideas.filter((item) => item._id !== selectedIdea._id);
        setIdeas(updatedIdeas);
        setSelectedIdea(null);
        window.location.reload(); 
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const searchIdeas = () => {
    Axios.get(`http://localhost:5000/idea/search?title=${searchTerm}`)
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="basic-container">
      <div className="topphoto">
        <img src={HeadPhoto} className="topbasic" alt="admin" />
        <h2>Just One Of Us</h2>
          <button onClick={onClick1} className="bbutton">
            File Info Page
          </button>
          <button onClick={onClick2} className="ybutton">
            Voting Info Page
          </button>
      </div>
      <div className='buseful'>
        <div className="idea-list">
          <h2 className='bfirst'>Idea List</h2>
          {ideas.map((idea) => (
            <div key={idea._id} className={`idea-item ${selectedIdea && selectedIdea._id === idea._id ? 'open' : ''}`}>
              <div className="idea-header" onClick={() => handleIdeaClick(idea)}>
                {idea.name}
              </div>
              {selectedIdea && selectedIdea._id === idea._id && (
                <div className="idea-details">
                  <div className='binline'>
                    <input
                      type="text"
                      className="name-input"
                      value={selectedIdea.name}
                      onChange={(e) => setSelectedIdea({ ...selectedIdea, name: e.target.value })}
                    />
                    <input
                      type="text"
                      className="description-input"
                      value={selectedIdea.description}
                      onChange={(e) => setSelectedIdea({ ...selectedIdea, description: e.target.value })}
                    />
                    <input
                      type="text"
                      className="tags-input"
                      value={selectedIdea.itags.join(', ')}
                      onChange={(e) => setSelectedIdea({ ...selectedIdea, itags: e.target.value.split(', ') })}
                    />
                  </div>
                  <div className='sinline'>
                    <button className="edit-button" onClick={editIdea}>Edit</button>
                    <button className="delete-button" onClick={deleteIdea}>Delete</button>
                    <p className='basicuser'>{user.nickname}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>

          <div className="create-idea">
            <h2>Create Idea</h2>
            <div className='firsttwo'>
              <input
                type="text"
                className='new-name'
                placeholder="Name:"
                value={newIdea.name}
                onChange={(e) => setNewIdea({ ...newIdea, name: e.target.value })}
              />
              <input
                type="text"
                className='new-description'
                placeholder="Description:"
                value={newIdea.description}
                onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
              />
            </div>
            <input
              type="text"
              className='new-tags'
              placeholder="Tags (comma-separated):"
              value={newIdea.itags.join(', ')}
              onChange={(e) => setNewIdea({ ...newIdea, itags: e.target.value.split(', ') })}
            />
            <button onClick={createIdea} className='createb'>Create</button>
          </div>

          <div className="search-list">
            <h2>Search Ideas</h2>
            <div>
              <input
                type="text"
                className='bsearchi'
                placeholder="Search by title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={searchIdeas} className='bssubmit'>Search</button>
            </div>
            <div className="search-results">
              {searchResults.map((idea) => (
                <div
                  key={idea._id}
                  className={`sidea-item ${selectedIdea && selectedIdea._id === idea._id ? 'open' : ''}`}
                  onClick={() => handleIdeaClick(idea)}
                >
                  {idea.name}
                  {selectedIdea && selectedIdea._id === idea._id && (
                    <div className="sidea-details">
                      <input
                        type="text"
                        className='snamei'
                        value={selectedIdea.name}
                        onChange={(e) => setSelectedIdea({ ...selectedIdea, name: e.target.value })}
                      />
                      <input
                        type="text"
                        className='sdesi'
                        value={selectedIdea.description}
                        onChange={(e) => setSelectedIdea({ ...selectedIdea, description: e.target.value })}
                      />
                      <input
                        type="text"
                        className='stagsi'
                        value={selectedIdea.itags.join(', ')}
                        onChange={(e) => setSelectedIdea({ ...selectedIdea, itags: e.target.value.split(', ') })}
                      />
                      <button onClick={editIdea} className='sedit'>Edit</button>
                      <button onClick={deleteIdea} className='sdelete'>Delete</button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Basic;
