import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylesheets/voting.css'
import { useCookies } from 'react-cookie';
import HeadPhoto from '../photos/fuji.jpg'

const Votes = () => {
  const [voteSheet, setVoteSheet] = useState({});
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [u, setU] = useState({});
  const [statistics, setStatistics] = useState({
    medianVotes: null,
    averageVotes: null,
    rangeVotes: null,
  });
  let userId = localStorage.getItem('userid')

  const [cookie,setCookie] = useCookies()
  const jwt = cookie.jwt
  useEffect(() => {
    if (!jwt) {
      window.location.assign('/login');
    }
  })
  useEffect(() => {
    axios.get(`http://localhost:5000/user/one/${userId}`)
      .then((response) => {
        console.log(response.data); // Check the structure of the received user data
        setU(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  })

  const industries = [
    'computer',
    'finance',
    'manufacturing',
    'agriculture',
    'medical',
    'education',
    'defense',
    'energy',
    'entertainment',
    'law',
  ];

  useEffect(() => {
    fetchVoteSheet('YourVoteSheetName');
    // Fetch other data on component mount if needed
  }, []);

  const fetchVoteSheet = async (sheetName) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/vote/sheet?name=Second Sheet`);
      setVoteSheet(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Error fetching vote sheet');
    }
  };

  const addVote = async () => {
    try {
        console.log(selectedIndustry)
      setLoading(true);
      const response = await axios.patch(`http://localhost:5000/vote/voting?name=Second Sheet&industry=${selectedIndustry}`);
      setVoteSheet(response.data);
      setLoading(false);
      fetchVoteSheet()
      axios.patch(`http://localhost:5000/user/voted/${userId}`)
      .then((response) => {
        console.log(response)
      })
    } catch (error) {
      setLoading(false);
      setError('Error adding vote');
    }
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const medianResponse = await axios.get(`http://localhost:5000/vote/median`);
      const averageResponse = await axios.get(`http://localhost:5000/vote/average`);
      const rangeResponse = await axios.get(`http://localhost:5000/vote/range`);

      setStatistics({
        medianVotes: medianResponse.data.overallMedian,
        averageVotes: averageResponse.data.overallAverage,
        rangeVotes: `${rangeResponse.data.lowestVotes}-${rangeResponse.data.highestVotes}`,
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Error fetching statistics');
    }
  };

  const onClick1 = () => {
    window.location.href = '/files';
  };

  const onClick2 = () => {
    window.location.href = '/basic';
  };

  return (
    <div className='vcontainer'>
        <div className='vfront'>
            <div className="topphoto">
                <img src={HeadPhoto} className="topvoting" alt="admin" />
                <h2>Just One Of Us</h2>
                <button onClick={onClick1} className="bbutton">
                    File Info Page
                </button>
                <button onClick={onClick2} className="ybutton">
                    Basic Info Page
                </button>
            </div>
        </div>
        <div className='vuseful'>
        <h1 className='vh1'>Voting System</h1>
            {loading && <p className='vloading'>Loading...</p>}
            {error && <p className='verror'>{error}</p>}
            {u && u.timesVoted === 3 ? (
              <div className='vvoteform1'>
                <h3>Max Times Voted Already</h3>
              </div>
            ) : (
              <div className='vvoteform'>
                  <h2 className='vaddv'>Add Vote: </h2>
                  <select value={selectedIndustry} onChange={(e) => setSelectedIndustry(e.target.value)} className='vindsel'>
                  <option value="" className='vindustryop'>Select an Industry</option>
                  {industries.map((industry) => (
                      <option key={industry} value={industry} className='vopsel'>{industry} </option>
                  ))}
                  </select>
                  <button onClick={addVote} className='vaddvote'>Add Vote</button>
              </div>
            )}
            <div className='vvsheet'>
                <h2 className='vh2'>Vote Sheet:</h2>
                {voteSheet && voteSheet.industries && voteSheet.industries.length > 0 && (
                <div className='vvotesheet'>
                    {Object.entries(voteSheet.industries.reduce((acc, curr) => {
                    acc[curr.name] = curr.value;
                    return acc;
                    }, {})).map(([key, value]) => (
                    <div key={key}>
                        <p className='vvotesub'>{key}: {value}</p>
                    </div>
                    ))}
                    <div>
                    </div>
                </div>
                )}
            </div>
            <div className='vstats'>
                <h2 className='vstatsh2'>Statistics:</h2>
                <button onClick={fetchStatistics} className='vgetstats'>Get Statistics</button>
                <div className='vstainfo'>
                    <p className='vmedian'>Median Votes For Industry: {statistics.medianVotes}</p>
                    <p className='vaverage'>Average Votes For Industry: {statistics.averageVotes}</p>
                    <p className='vrange'>Range Votes For Industry: {statistics.rangeVotes}</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Votes;
