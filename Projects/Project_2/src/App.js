import "./App.css";
import { useState ,useEffect} from "react";
function App() {
  const [keyword, setkeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState([]);

  const [trendingTracks, setTrendingTracks] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const getAccessToken = async () => {
      const clientId = "a012327d663e4a6887d84ff4490a333b";
      const clientSecret = "6dd59a95fb4a4250834ec7069043535d";
      const authString = `${clientId}:${clientSecret}`;
      const authBase64 = btoa(authString);

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authBase64}`,
        },
        body: "grant_type=client_credentials",
      });

      const data = await response.json();
      setAccessToken(data.access_token);
    };

    getAccessToken();
  }, []);

  useEffect(() => {
    const getTrendingTracks = async () => {
      if (!accessToken) return;

      setIsLoading(true);
      try {
        let data = await fetch(
          `https://api.spotify.com/v1/browse/new-releases`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!data.ok) {
          throw new Error(`Error: ${data.status} ${data.statusText}`);
        }

        let convertedData = await data.json();
        console.log(convertedData);

        // Check if albums and items exist in the response
        if (convertedData.albums && convertedData.albums.items) {
          const albums = convertedData.albums.items;
          setTrendingTracks(albums);
        } else {
          console.error("Unexpected response structure:", convertedData);
        }
      } catch (error) {
        console.error("Failed to fetch trending tracks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getTrendingTracks();
  }, [accessToken]);



  const getTracks = async () => {
    setIsLoading(true);
    let data = await fetch(
      `https://v1.nocodeapi.com/kunal_/spotify/dbzdLlVHxVXyhUyR/search?q=${keyword}&type=track`
    );
    let convertedData = await data.json();
    console.log(convertedData.tracks.items);

    setTracks(convertedData.tracks.items);
    setIsLoading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getTracks();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg  ">
        <>
          <div className="shadow-lg p-3 mb-5 bg-body-tertiary rounded"></div>
        </>

        <div className="container-fluid ">
          <a className="navbar-brand" href="/">
            Music Track Search
          </a>
{/* ////////////////////////////////////////////////////////////////// */}
          <div
            className="collapse navbar-collapse d-flex justify-content-center"
            id="navbarSupportedContent"
          >
            <form className="d-flex w-50" onSubmit={handleSubmit} role="search">
              <input
                value={keyword}
                onChange={(event) => setkeyword(event.target.value)}
                className="form-control me-2 w-75"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button onClick={getTracks} className="btn btn-outline-success">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container ">
        <div className={`row ${isLoading ? "" : "d-none"}`}>
          <div className="col-12 py-5 text-center">
            <div
              className="spinner-border"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            ></div>
          </div>
          <span className=" flex text-xl-center">Loading...</span>
        </div>
        <div className="row">
          {tracks.map((element) => (
            <div key={element.id} className="col-lg-3 col-md-6 py-2">
              <div className="card">
                <img
                  src={element.album.images[0].url}
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">{element.name}</h5>
                  <p className="card-text">
                    Artist: {element.album.artists[0].name}
                  </p>
                  <p className="card-text">
                    Release Date: {element.album.release_date}
                  </p>
                  {element.preview_url ? (
                    <audio
                      src={element.preview_url}
                      controls
                      className="w-100"
                    ></audio>
                  ) : (
                    <p className="text-muted">No preview available</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          <h2>Trending Songs</h2>
          {trendingTracks.map((element) => (
            <div key={element.id} className="col-lg-3 col-md-6 py-2">
              <div className="card">
                <img
                  src={element.images[0].url}
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">{element.name}</h5>
                  <p className="card-text">
                    Artist: {element.artists[0].name}
                  </p>
                  <p className="card-text">
                    Release Date: {element.release_date}
                  </p>
                  {element.preview_url ? (
                    <audio
                      src={element.preview_url}
                      controls
                      className="w-100"
                    ></audio>
                  ) : (
                    <p className="text-muted">No preview available</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
      </div>
    </>
  );
}

export default App;
