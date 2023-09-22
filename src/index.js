import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  HashRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  Link,
  Outlet,
} from "react-router-dom";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const Header = () => {
  return (<>
  <h1 className="heading">Music Imposter
 </h1>
 
  
  </>);
};

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-left">
        <span>© 2023 Music Imposter, Inc.</span>
        <ul>
          <li>Backend : JD</li>
          <li>Frontend : KD</li>
        </ul>
      </div>
      <div className="footer-right">
        <i className="fa-brands fa-square-github"></i>
        <i className="fa-brands fa-square-twitter"></i>
        <i className="fa-brands fa-square-instagram"></i>
        {/* <audio src='https://detrojajenish.pythonanywhere.com/static/song/gta_samurai.mp3' constrols ></audio> */}
      </div>
    </div>
  );
};

const Login = () => {
  const nav = useNavigate();
  var allSet = true;
  const mySubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    /*below fetch only response status 202 for success and 404 for error*/
    fetch(
      "https://detrojajenish.pythonanywhere.com/login?userName=" + formData.get("userName"),
      {method: "GET",mode: "cors"}
    )
      .then((res) => {
        console.log(res);
        if (res.status == 404) {
          alert("enter valid name or name is already taken by other user");
          throw "error";
        }
      })
      .then(() => {
        nav("/host_join/" + formData.get("userName"));
      })
      .catch((e) => {
        console.log(e);
        allSet = false;
      });
  };
  return (
    <div className="page1">
      <form onSubmit={mySubmit} className="login-box">
        <h2>
          <Link to="/host_join/:userName" className="main">
            Main Page
          </Link>
        </h2>
        <div className="input-box">
          <input type="text" name="userName" placeholder="player Name" />
          <input type="submit" />
        </div>
      </form>
      <img src={process.env.PUBLIC_URL + "/game-players.png"} alt="" className="player-img" />
    </div>
  );
};

const Host_join = () => {
  const { userName } = useParams();
  return (
    <div className="page2">
      <div className="host-join-box">
        <h2>
          <Link to="/host_join/:userName" className="main">
            Main Page
          </Link>
        </h2>
        <button className="box-btn">
          <Link to={`/host/${userName}`} className="btn-lbl">
            Host a game
          </Link>
        </button>

        <button className="box-btn">
          <Link to={`/join/${userName}`} className="btn-lbl">
            join game
          </Link>
        </button>
      </div>
    </div>
  );
};

const HostGame = () => {
  const [gameId, setGameId] = useState("");
  const [clickCount, setClickCount] = useState(1);
  const [count, setCount] = useState(5);
  const [intervalData, setIntervalData] = useState(null);
  const { userName } = useParams();
  const nav = useNavigate();
  
  useEffect(() => {
    //below api genrates gameId and resopse it which has field called gameId
    fetch("https://detrojajenish.pythonanywhere.com/genrateGameId?userName=" + userName, {method: "GET",mode: "cors"})
      .then((res) => res.json())
      .then((res) => setGameId(res.gameId));
  }, []);

  function countDown() {
    if (`${clickCount}` == 1) {
      setClickCount(pri => pri + 1);
      
      var ref = setInterval(() => {
        setCount((pri) => pri - 1);
      }, 1000);
      setIntervalData(ref);

      setTimeout(stop, 6000);

      function stop() {
        clearInterval(intervalData);
        nav(`/gameConstrols/${userName}/${gameId}`);
      }
    }
  }
  
  return (
    <div className="host-page">
      <div className="host-box">
        <h2 id="countdown">આક્રમણ in {count} ...</h2>
        <button className="box-btn" onClick={countDown} >
          {" "}
          <span className="btn-lbl">start game</span>
        </button>
      </div>
    </div>
  );
};

const JoinGame = () => {
  const { userName } = useParams();

  const nav = useNavigate();
  const mySubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    var allSet = true;
    fetch(
      "https://detrojajenish.pythonanywhere.com/join" +
        "?userName=" +
        userName +
        "&gameId=" +
        formData.get("gameId"),
        {method: "GET",mode: "cors"}
    )
      .then((res) => {
        if (res.status === 404) {
          alert("there is no game with this gameid");
          throw new Error("error occured");
        }
        return res.json();
      })
      .then(() => {
        nav(`/gameConstrols/${userName}/${formData.get("gameId")}`);
      })
      .catch((e) => {
        console.log(e);
        allSet = false;
      });
  };
  return (
    <div className="join-page">
      <div className="joingame-box">
        <form onSubmit={mySubmit} className="input-box">
          <input type="text" name="gameId" placeholder="Game Id" />
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

const GameDashBoard = () => {
  // const [game, setGame] = useState({
  //   gameId: "205",
  //   host: "Kishan",
  //   players: ["Jenish", "Viral", "Parth"],
  //   play: true,
  //   pause: false,
  //   songPlayed: ["abc", "xyz"],
  //   imposter: "Parth",
  //   imposterSong: "xyz",
  //   civilianSong: "abc",
  // });
  const [game, setGame] = useState({})
  const [src, setSrc] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { gameId, userName } = useParams();
  // const nav = useNavigate();

  const isHost = () => {
    return userName === game.host;
  };
  const startGame = () => {
    //sends message to server to start game
    fetch(
      `https://detrojajenish.pythonanywhere.com/game/start?gameId=${gameId}&userName=${userName}`,
      {method: "GET",mode: "cors"}
    ).catch((e) => console.log(e));
  };

  const stopGame = () => {
    //sends message to stop music
    fetch(
      `https://detrojajenish.pythonanywhere.com/game/stop?gameId=${gameId}&userName=${userName}`,
      {method: "GET",mode: "cors"}
    ).catch((e) => console.log(e));
  };

  useEffect(() => {
    if (src !== "") {
      if (isPlayingAudio) {
        console.log(src);
        setTimeout(()=>{document.getElementById("music").play()},5000);
        setTimeout(()=>{setIsPlayingAudio(prev=>!prev)}, 60000)
        // setTimeout(()=>{document.getElementById("music").play()},5000)
      } else {
        document.getElementById("music").pause();
      }
    }
  }, [isPlayingAudio, src]);

  useEffect(() => {
    fetch("https://detrojajenish.pythonanywhere.com/game?gameId=" + gameId,
    {method: "GET",mode: "cors"}
    )
    .then(res=>res.json())
    .then(res=>setGame(res))

    const gameEvent = new EventSource(
      `https://detrojajenish.pythonanywhere.com/gameStatus?gameId=${gameId}&userName=${userName}`,{method: "GET",mode: "cors"}
    );
    //server send play event when host starts a game
    gameEvent.addEventListener("play", (e) => {
      console.log(e.data);
      const data = JSON.parse(e.data);
      if (!isPlayingAudio) {
        setIsPlayingAudio((prev) => !prev);
      }
      
      if (src === "") {
        setSrc((prev) => data.src);
      }
    });

    gameEvent.addEventListener("pause", (e) => {
      console.log(e.data);
      console.log("..............")
      if (isPlayingAudio) {
        setIsPlayingAudio((prev) => !prev);
      }
    });

    return () => {
      gameEvent.close();
    };
  }, []);
  return (
    <div className="page3">
      <div className="dashboard-box">
        <h3 className="player-info">
          hey <span>{userName}</span> ,
          <br />
          <br />
          your gameId : <span>{game.gameId}</span>
        </h3>
        <br />
        <h3 className="instructions">
          <span>{game.host}</span> is navigating like boss...
          <br />
          be careFull there is one imposter among you...
          <br />
          Your companions are...
        </h3>
        <ul className="players-list">
          {game.players !== undefined
            ? game.players.map((player, index) => (
                <li key={index}> {player} </li>
              ))
            : "wait..."}
        </ul>
        {src !== "" ? (
          <div className="music">
            <audio id="music" src={src} ></audio>
          </div>
        ) : (
          <h3>
            {" "}
            <span>Aeee Halo...</span>
          </h3>
        )}

        <div className="host-control">
          {isHost() ? (
            <>
              <h3>ya i'm a boss...</h3>{" "}
              <div className="music-btn">
                <button
                  className="box-btn"
                  onClick={() => {
                    startGame();
                  }}
                >
                  Let's Dance
                </button>{" "}
                <button
                  className="box-btn"
                  onClick={() => {
                    stopGame();
                  }}
                >
                  pause
                </button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

const Layout = () => {
  return (
    <>
      <Header />

      <Outlet />
      <Footer />
    </>
  );
};

root.render(
  <>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />}></Route>
          <Route path="/host_join/:userName" element={<Host_join />}></Route>
          <Route path="/host/:userName" element={<HostGame />}></Route>
          <Route path="/join/:userName" element={<JoinGame />}></Route>
          <Route
            path="/gameConstrols/:userName/:gameId"
            element={<GameDashBoard />}
          ></Route>
        </Route>
      </Routes>
    </HashRouter>
  </>
);
