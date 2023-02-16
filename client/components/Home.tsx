import { reset } from "https://deno.land/std@0.152.0/fmt/colors";
import { useEffect } from "https://esm.sh/v106/@types/react@18.0.27/X-ZC9yZWFjdEAxOC4yLjA/index";
import { React, useObsidian, BrowserCache, LFUCache } from "../../deps/deps.client.ts";
import Bar from "./Bar.tsx";
import imageURL from "../photo.json"



import InputField from "./InputField.tsx";
import  CharacterCards  from "./CharacterCards.tsx"
/*
deno install -qAf --unstable https://deno.land/x/denon/denon.ts
export PATH="/Users/mattweisker/.deno/bin:$PATH"

*/

const Home = () => {
  const { query, cache, setCache, mutate } = useObsidian();
  const [people, setPeople] = React.useState([]);
  // const [person, setPerson] = React.useState({name: '', mass: ''});
  const [search, setSearch] = React.useState('');
  // const [addForm, setAddForm] = React.useState(false)
  const [getAllDisplay, setGetAllDisplay] = React.useState(false);
  const [searchInputDisplay, setSearchInputDisplay] = React.useState(false);
  const [addForm, setAddForm] = React.useState(false)


  // const [addContent, setAddContent] = React.useState({name: '', mass: '', hair: '', skin: '', eye: '', gender: '', height: ''})
  const [addContent, setAddContent] = React.useState({name: 'Mike Landswimmer', mass: '420', hair: 'Obsidian', skin: 'Obsidian', eye: 'Obsidian', gender: 'Flexible', height: 10, url: ''})


  const [callData, setCallData] = React.useState({});
  const [currentQuery, setCurrentQuery] = React.useState('')
  // const [addName, setAddName] = React.useState('');
  // const [mass, setMass] = React.useState('');
  // const [hair, setHair] = React.useState('');
  // const [skin, setSkin] = React.useState('')
  // const [eye, setEye] = React.useState('');
  // const [gender, setGender] = React.useState('');
  // const [height, setHeight] = React.useState(''); 


  const queryStr = `query {
      allPeople {
        _id
        name
        mass
        hair_color
        skin_color
        eye_color
        gender
        height
      }
    }
  `;

  const queryStrName = `query {
    onePerson (name: "${search}") {
      _id
      name
      mass
      hair_color
      skin_color
      eye_color
      gender
      height
    }
  }`

  // const [addContent, setAddContent] = React.useState({name: '', mass: '', hair: '', skin: '', eye: '', gender: '', height: ''})

  const queryStrAddCharacter = `mutation {
    addPerson (name: "${addContent.name}",
                mass: "${addContent.mass}",
                hair_color: "${addContent.hair}",
                skin_color: "${addContent.skin}",
                eye_color: "${addContent.eye}",
                gender: "${addContent.gender}",
                height: ${addContent.height}
              ) {
      _id
      name
      mass
      hair_color
      skin_color
      eye_color
      gender
      height
    }
  }`

  // const queryStrMass = `query {
  //   onePerson (mass: "45") {
  //     _id
  //     name
  //     mass
  //   }
  // }`


 const handleChange = (event: any, stateChange: any) => {
  stateChange(event.target.value);
 }
 const handleNewChar = (event: any, key: any) => {
  event.preventDefault()
  const newContent: object = {...addContent}
  newContent[key] = event.target.value
  if (key === 'height') newContent[key] = Number(event.target.value)
  setAddContent(newContent)
  console.log(addContent)
 }


  const getAllButton = () => {
    if (!getAllDisplay) {
      setGetAllDisplay(true);
      setAddForm(false);
      setSearchInputDisplay(false);
    }
  }

  const searchOneCharButton = () => {
  if (!searchInputDisplay) {
    setSearchInputDisplay(true);
    setAddForm(false);
    setGetAllDisplay(false);
  } 
  else {
    if (search !== "") {
      query(queryStrName)
      .then(resp => {
        let data = resp.data.onePerson;
        if (!Array.isArray(data)) {
          data = [data]
        }
        setPeople(data)
        const query = `Search For ${search}`
        setCurrentQuery(query)
        const dataCopy = {...callData};
        if (!dataCopy[query]) dataCopy[query] = [];
        dataCopy[query].push(resp.time)
        setCallData(dataCopy)
        setSearchInputDisplay(false)
      })
    }
  }
}

const addCharacterButton = () => {
  if (!addForm) {
    setAddForm(true);
    setSearchInputDisplay(false);
    setGetAllDisplay(false);
  } 
  else {
    mutate(queryStrAddCharacter)
    .then(resp => {
      const data = [resp.data.addPerson]
      setPeople(data);
      setAddForm(false);
      setCurrentQuery('');
      imageURL[addContent.name] = addContent.url
    })
  }
}

const getAllCharacters = (
  <div className="input-field-div">
    <div className="input-no-button">
      <p>Get a list of all characters in the database</p>
    </div>
    <button
      onClick={() => {
        query(queryStr)
        .then(resp => {
          setPeople(resp.data.allPeople)
          const query = "Search All Characters"
          setCurrentQuery(query)
          const dataCopy = {...callData};
          if (!dataCopy[query]) dataCopy[query] = [];
          dataCopy[query].push(resp.time)
          setCallData(dataCopy)
          setGetAllDisplay(false)
        })
      }}
      >All</button>
  </div>
)

const searchOneCharacter = (
  <div className="input-field-div">
    <div className="input-no-button">
      <p>Get information about a single character in the database</p>
      <input className="character-search" type="text" onChange={(e) => handleChange(e, setSearch)}></input>
    </div>
    <button 
        onClick={() => {
            searchOneCharButton();
        }}
        placeholder="Search by character name"
    >One</button>
  </div>
)

const addCharacter = (
  <div className="input-field-div">
    <div className="input-no-button">
      <p>Add a character to the database</p>
      <form className="add-character-form">
        <div id="add-input-row-1">

          <div className="add-character-input">
            <label>Name</label>
            <input onChange={(e) => handleNewChar (e, "name")}></input>
          </div>

          <div className="add-character-input">
            <label>Height</label>
            <input onChange={(e) => handleNewChar (e, "height")}></input>
          </div>

          <div className="add-character-input">
            <label>Mass</label>
            <input onChange={(e) => handleNewChar (e, "mass")}></input>
          </div>

          <div className="add-character-input">
            <label>Gender</label>
            <input onChange={(e) => handleNewChar (e, "gender")}></input>
          </div>

        </div>
        <div id="add-input-row-2">

        <div className="add-character-input">
            <label>Hair-Color</label>
            <input onChange={(e) => handleNewChar (e, "hair")}></input>
          </div>

          <div className="add-character-input">
            <label>Skin-Color</label>
            <input onChange={(e) => handleNewChar (e, "skin")}></input>
          </div>

          <div className="add-character-input">
            <label>Eye-Color</label>
            <input onChange={(e) => handleNewChar (e, "eye")}></input>
          </div>

          <div className="add-character-input">
            <label>Image URL</label>
            <input onChange={(e) => handleNewChar (e, "url")}></input>
          </div>
        </div>
      </form>
    </div>
    <button
      onClick={() => {
        addCharacterButton()
      }}
    >Add</button>
  </div>

)

  let searchAll = 'white';
  let searchOne = 'white';
  let addOne = 'white';
  if (getAllDisplay) searchAll = "#2E67F8";
  if (searchInputDisplay) searchOne = "#EB212E";
  if (addForm) addOne = "#2FF924";

  return (
    <div className="home-container">
      <div className="opening-crawl">
        <h1>Who has the high ground?</h1>
      </div>


      
      {/* <div className="get-all-characters">
        <button
        onClick={() => {
          query(queryStr)
          .then(resp => {
            // console.log('regular response ', resp)
            setPeople(resp.data.allPeople)
            const query = "Search All Characters"
            setCurrentQuery(query)
            const dataCopy = {...callData};
            if (!dataCopy[query]) dataCopy[query] = [];
            dataCopy[query].push(resp.time)
            setCallData(dataCopy)
            // console.log('cache ', cache)
            // console.log('new response ', resp.time)
            // console.log(people.length)
            console.log(callData);
            console.log(currentQuery)
          })
          // .then(resp => setCache(new LFUCache(cache.storage)))
        }}
        >Get All Characters</button>
      </div>

      <div className="search-characters">
        <input type="text" onChange={(e) => handleChange(e, setSearch)}></input>
        <button 
      onClick={() => {
        query(queryStrName)
        .then(resp => {
          // console.log('front end console ', resp)
          let data = resp.data.onePerson;
          if (!Array.isArray(data)) {
            data = [data]
          }
          // const data = resp.data.onePerson
          // const cacheData = resp.data.onePerson[0]
          // console.log('cache data ', cacheData)
          // setPerson({name: data.name, mass: data.mass})
          setPeople(data)

          const query = `Search For ${search}`
          setCurrentQuery(query)
          const dataCopy = {...callData};
          if (!dataCopy[query]) dataCopy[query] = [];
          dataCopy[query].push(resp.time)
          setCallData(dataCopy)
          // if (cacheData) setPerson({name: cacheData.name, mass: cacheData.mass})
          // console.log('person state ', person)
        }) */}
      
      <div className="mid-container">
        <div className="button-container">
          <div className="get-all-characters">
            <button
            style={{"backgroundImage": `url(${imageURL['Search All']})`, "boxShadow": `0 0 25px ${searchAll}`}}
            onMouseEnter={() => {
              getAllButton();
            }}
            ></button>
          </div>

          <div className="search-characters">
            <button
              style={{"backgroundImage": `url(${imageURL['Search One']})`, "boxShadow": `0 0 25px ${searchOne}`}} 
              onMouseEnter={() => {
                if (!searchInputDisplay) {
                  searchOneCharButton();
                }
              }}
          ></button>   
          </div>

          <div className="add-character">
            <button
              style={{"backgroundImage": `url(${imageURL['unknown']})`, "boxShadow": `0 0 25px ${addOne}`}}
              onMouseEnter={() => {
                if (!addForm) {
                  addCharacterButton()
                }
              }}
            ></button>
          </div>
        </div>  
        
        <InputField 
          addForm={addForm} 
          addCharacter={addCharacter} 
          searchInputDisplay={searchInputDisplay} 
          searchOneCharacter={searchOneCharacter} 
          getAllCharacters={getAllCharacters}
          getAllDisplay={getAllDisplay}/>
      </div>



      <div>
      
      <div className="response-container">
        <div className="character-container">
            {people && people.map((char) => (
              <>
              <CharacterCards char={char}/>
              </>
            ))}

        </div>
        <div className="graph-container">
            { <Bar callData={callData} currentQuery={currentQuery} /> }
        </div>
      </div>
      </div>

      <div className="footer">
        <p>Copyright © Obsidian 2023</p>
      </div>
    </div>
  );
}

export default Home;
