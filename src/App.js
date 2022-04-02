import "./App.css";
import banner from "./assets/marvel-bg.svg";
import MarvelLogo from "./assets/marvel.svg";

import leftArrow from "./assets/l_arrow.png";
import rightArrow from "./assets/r_arrow.png";

import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [totalCharacterCount, setTotalCharacterCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!sessionStorage.getItem(`current Page: ${currentPage}`)) {
      getCharacters(true);
    } else {
      const sessionData = JSON.parse(
        sessionStorage.getItem(`current Page: ${currentPage}`)
      );
      setCharacters(sessionData.results);
      setTotalCharacterCount(sessionData.total);
      setLoading(false);
    }
  }, [offset]);

  function handleClick(e) {
    setOffset((e - 1) * 20);
    setCurrentPage(e);
  }

  const fetchData = async () => {
    const data = await axios.get(
      `https://gateway.marvel.com:443/v1/public/characters?limit=20&offset=${offset}&apikey=8fe60df9043ca82bac87ba80098f1c1a`
    );
    return data;
  };

  function getCharacters(setSession) {
    fetchData()
      .then((res) => {
        setCharacters(res.data.data.results);
        setTotalCharacterCount(res.data.data.total);
        setLoading(false);
        if (setSession) setDataOnSession(res);
      })
      .catch(console.error);
  }

  function setDataOnSession(res) {
    sessionStorage.setItem(
      `current Page: ${currentPage}`,
      JSON.stringify(res.data.data)
    );
  }

  function inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
  }

  return (
    <div>
      <header id="bg-section">
        <img src={banner} alt="Marvel Background" />
        <img id="marvel-text" src={MarvelLogo} alt="Marvel Logo" />
      </header>
      {loading ? (
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      ) : (
        <div className="wrapper">
          <div id="hero-box" className="m-auto">
            {characters.map((character, i) => (
              <div key={`${character.name}${i}`} className="hero-card">
                <img
                  className="hero-img"
                  src={`${character.thumbnail.path}/portrait_incredible.${character.thumbnail.extension}`}
                  alt={`${character.name}`}
                />
                <div className="hero-font">{character.name}</div>
              </div>
            ))}
          </div>
          <div className="pagination m-auto">
            {currentPage <= 4 && (
              <>
                {/* For loop with creating empty array */}
                {[...Array(5)].map((x, i) =>
                  currentPage === i + 1 ? (
                    <span
                      key={`${x}${i}`}
                      className="pag-center"
                      onClick={() => handleClick(i + 1)}
                    >
                      {i + 1}
                    </span>
                  ) : (
                    <span key={`${x}${i}`} onClick={() => handleClick(i + 1)}>
                      {i + 1}
                    </span>
                  )
                )}
                <span>...</span>
                <span onClick={() => handleClick(totalCharacterCount / 20)}>
                  {totalCharacterCount / 20}
                </span>
                <img
                  src={rightArrow}
                  alt=""
                  onClick={() => handleClick(currentPage + 1)}
                />
              </>
            )}

            {inRange(currentPage, 5, totalCharacterCount / 20 - 6) && (
              <>
                <img
                  src={leftArrow}
                  alt=""
                  onClick={() => handleClick(currentPage - 1)}
                />
                <span onClick={() => handleClick(1)}>1</span>
                <span>...</span>
                <span onClick={() => handleClick(currentPage - 1)}>
                  {currentPage - 1}
                </span>
                <span className="pag-center">{currentPage}</span>
                <span onClick={() => handleClick(currentPage + 1)}>
                  {currentPage + 1}
                </span>
                <span>...</span>
                <span onClick={() => handleClick(totalCharacterCount / 20)}>
                  {totalCharacterCount / 20}
                </span>
                <img
                  src={rightArrow}
                  alt=""
                  onClick={() => handleClick(currentPage + 1)}
                />
              </>
            )}

            {/* Zamanım olmadığı düm düz yazmak zorunda kaldım sorry. */}
            {inRange(currentPage, 73, 78) && (
              <>
                <img
                  src={leftArrow}
                  alt=""
                  onClick={() => handleClick(currentPage - 1)}
                />
                <span onClick={() => handleClick(1)}>1</span>
                <span>...</span>
                <span onClick={() => handleClick(73)}>73</span>
                <span onClick={() => handleClick(74)}>74</span>
                <span onClick={() => handleClick(75)}>75</span>
                <span onClick={() => handleClick(76)}>76</span>
                <span onClick={() => handleClick(77)}>77</span>
                <span onClick={() => handleClick(78)}>78</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
