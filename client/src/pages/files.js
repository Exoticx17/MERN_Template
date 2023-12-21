import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylesheets/files.css'
import HeadPhoto from '../photos/chinapark.jpg'
import { useCookies } from 'react-cookie';

const FileControllerComponent = () => {
  const [files, setFiles] = useState([]);
  const [originalFiles, setOriginalFiles] = useState([]); // Store the original list of files
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMeta, setSelectedMeta] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState(''); 
  const [newFileName, setNewFileName] = useState('');
  const [newFileDescription, setNewFileDescription] = useState('');
  const [postedFile, setPostedFile] = useState(null);


  const [cookie,setCookie] = useCookies()
  const jwt = cookie.jwt
  useEffect(() => {
    if (!jwt) {
      window.location.assign('/login');
    }
  })

  useEffect(() => {
    // Fetch all files on component mount
    fetchAllFiles();

    // Clean up when the component is unmounted
    return () => {
      if (selectedFile && selectedFile._id) {
        URL.revokeObjectURL(URL.createObjectURL(selectedFile._id));
      }
    };
  }, [selectedFile]);

  const onClick1 = () => {
    window.location.href = '/basic';
  };

  const onClick2 = () => {
    window.location.href = '/voting';
  };

  const handleCloseButtonClick = () => {
    setSelectedFile(null);
    setSelectedMeta(null);
  };

  const fetchAllFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/file/alljson');
      setFiles(response.data.files);
      setOriginalFiles(response.data.files); // Store the original list of files
      setSearchTerm(''); // Reset search term
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('file', postedFile); // Assuming 'selectedFile' contains the uploaded file
  
      await axios.post(`http://localhost:5000/file?name=${newFileName}&description=${newFileDescription}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // File created successfully, update file list or perform necessary actions
      fetchAllFiles(); // Assuming fetchAllFiles function updates the file list
  
      // Clear the form fields after successful submission
      setNewFileName('');
      setNewFileDescription('');
    } catch (error) {
      console.error('Error creating file:', error);
      // Handle error, show message to user, etc.
    }
  };
  

  const handleFileClick = async (name) => {
    try {
      // Fetch metadata
      const metadataResponse = await axios.get(`http://localhost:5000/file/metadata/${name}`);
      const metadata = metadataResponse.data;
      setSelectedMeta(metadata);

      // Fetch file content
      const fileResponse = await axios.get(`http://localhost:5000/file/one/${name}`, { responseType: 'blob' });
      const blob = fileResponse.data;

      const fileType = blob.type;
      if (fileType.startsWith('image/')) {
        const img = URL.createObjectURL(blob);
        setSelectedFile(<img src={img} alt="file" className='fimage' />);
      } else if (fileType.startsWith('video/')) {
        const src = URL.createObjectURL(blob);
        setSelectedFile(
          <video controls className='fvideo' src={src}/>
        );
      } else if (fileType.startsWith('audio/')) {
        const src = URL.createObjectURL(blob);
        setSelectedFile(
          <audio controls>
            <source src={src} type={fileType} className='faudio' />
          </audio>
        );
      } else {
        setSelectedFile(<p>File type not supported</p>);
      }
      console.log(selectedFile)
    } catch (error) {
      console.error('Error fetching file by name:', error);
    }
  };

  const handleSearch = async (name) => {
    try {
      setSearchTerm(name);

      if (name === '') {
        // If the search term is empty, revert to the original list of files
        setFiles(originalFiles);
      } else {
        // Filter files based on the search term
        const filteredFiles = originalFiles.filter((file) =>
          file.metadata.name.toLowerCase().includes(name.toLowerCase())
        );
        setFiles(filteredFiles);
      }
    } catch (error) {
      console.error('Error searching files:', error);
    }
  };

  const handleImageFilterByType = async (type) => {
    try {
      if (type === '') {
        // If the filter type is empty, revert to the original list of files
        setFiles(originalFiles);
      } else {
        const response = await axios.get('http://localhost:5000/file/type?type=image',{
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          withCredentials: true,
        });

        const responseData = response.data;
        setFiles(responseData);
      }
    } catch (error) {
      console.error('Error filtering files by type:', error);
    }
  };
  const handleVideoFilterByType = async (type) => {
    try {
      if (type === '') {
        // If the filter type is empty, revert to the original list of files
        setFiles(originalFiles);
      } else {
        const response = await axios.get('http://localhost:5000/file/type?type=video',{
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          withCredentials: true,
        });

        const responseData = response.data;
        setFiles(responseData);
      }
    } catch (error) {
      console.error('Error filtering files by type:', error);
    }
  };
  const handleAudioFilterByType = async (type) => {
    try {
      if (type === '') {
        // If the filter type is empty, revert to the original list of files
        setFiles(originalFiles);
      } else {
        const response = await axios.get('http://localhost:5000/file/type?type=audio',{
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          withCredentials: true,
        });

        const responseData = response.data;
        setFiles(responseData);
      }
    } catch (error) {
      console.error('Error filtering files by type:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/file/delete?id=${id}`);
      console.log('File deleted successfully');
      // Update the file list after deletion
      fetchAllFiles();
      handleCloseButtonClick();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0]; // Assuming only one file is selected
    setPostedFile(selected);
  };
  

  return (
    <div className='fcontainer'>
      <div className="ftopphoto">
        <img src={HeadPhoto} className="ftopbasic" alt="admin" />
        <h2>Another Day Another Dollar</h2>
          <button onClick={onClick1} className="fbbutton">
            Basic Info Page
          </button>
          <button onClick={onClick2} className="fybutton">
            Voting Info Page
          </button>
      </div>
      <div className='fuseful'>
      <h1 className='fheader'>File Controller</h1>
      <ul className='flist'>
        {files && files.length > 0 ? (
          files.map((file) => (
            <li key={file._id} onClick={() => handleFileClick(file.metadata.name)} className='flitem'>
              {file.metadata.name}
            </li>
          ))
        ) : (
          <li>No files to display</li>
        )}
      </ul>

      {selectedFile && (
        <div>
          {/* Display selected file information */}
          <h2 className='fmeta'>Selected File:</h2>
          <div className='selectedfile'>
            <div className='file-info'>
                <h2 className='fmetah2'>Selected File:</h2>
                <p className='fmetaname'>Name: {selectedMeta.name}</p>
                <p className='fmetades'>Description: {selectedMeta.description}</p>
                <div className='button-container'>
                    <button onClick={() => handleDelete(selectedMeta._id)} className='fdeletebut'>Delete File</button>
                    <button onClick={handleCloseButtonClick} className='fclosebut'>Close</button>
                </div>
            </div>
            <div className='ffile'>
                {selectedFile}
            </div>
        </div>
        </div>
      )}

      {/* Search input */}
      <div className='fsearchcon'>
        <input
          type="text"
          className='fsinput'
          placeholder="Search files"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* Reset search button */}
        <button onClick={() => handleSearch('')} className='fresetbut'>Reset Search</button>

        {/* Filter by type buttons */}
        <button onClick={() => handleImageFilterByType('image')} className='fimabut'>Filter Images</button>
        <button onClick={() => handleVideoFilterByType('video')} className='fvidbut'>Filter Videos</button>
        <button onClick={() => handleAudioFilterByType('audio')} className='faudbut'>Filter Audio</button>
      </div>

      {/* Form for creating a file */}
    <div className="file-creation-form">
      <h2 className='fcreateh2'>Create a File</h2>
      <form onSubmit={handlePostSubmit} className='fcreateform'>
          <input
            type="text"
            className='fcreatename'
            placeholder='Name:'
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
          <textarea
            value={newFileDescription}
            placeholder='Description:'
            className='fcreatedes'
            onChange={(e) => setNewFileDescription(e.target.value)}
          ></textarea>
          <input type="file" onChange={handleFileChange} className='fcreatefilebut'/>
        <button type="submit" className='fsubmitbut'>Create File</button>
      </form>
    </div>
      </div>
    </div>  
  );
};

export default FileControllerComponent;
