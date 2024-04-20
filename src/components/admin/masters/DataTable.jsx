import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { Button, Alert } from "react-bootstrap";
import { useApi } from "contexts/ApiContext";
import { useTranslation } from "contexts/TranslationContext";
import Spinner from "./Spinner";
import DataModal from "./DataModal";
import "./DataTable.css";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

const DataTable = (props) => {
  const { get, post, put, deletex } = useApi();
  const { languages, __ } = useTranslation();


  const { url, model, masters } = props; // , fields, validateInsert, validateUpdate

  const [objects, setObjects] = useState([]);
  const [masterData, setMasterData] = useState({});

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    object: {},
    readOnly: false,
    visible: false,
    saveEvent: null,
    messages: [],
  });

  const [sortCol, setSortCol] = useState('')
  const [sortDir, setSortDir] = useState('asc')

  const addSort = (col) => {
    // console.log('addSort', col, sortCol, sortDir)
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const DataIndexEvent = useCallback(async (forced = false) => {
    const languageCodes = Object.keys(languages);

    if (objects.length === 0 || forced) {
      console.log("DataIndexEvent", forced, objects);
      // console.log('objects', objects)
      setLoading(true); // bekapcsoljuk a homokórát
      try {

        let promises = [get(url + "?nolang=true")];
        Object.keys(masters).forEach((m) => promises.push(get(masters[m].url + "?nolang=true")))
        const [mainResp, ...mastResponses] = await Promise.all(promises);
        //setError(""); // kitöröljük a hibát
        setObjects(mainResp.data); // beállítjuk az objektumok állapotát a válaszban kapott listával
        const masterData = {};
        mastResponses.forEach((response, idx) => {
          const masterKey = Object.keys(masters)[idx]
          const master = masters[masterKey]

          console.log(masters, idx, master, response.data)
          const masterElements = {};
          response.data.forEach(item => {
            masterElements[item.id] = {}
            languageCodes.forEach(lang => {
              if (item.hasOwnProperty('name_' + lang)) {
                masterElements[item.id][lang] = item['name_' + lang];
              }
            })
            if (item.hasOwnProperty('name')) {
              masterElements[item.id][''] = item['name'];
            }
          });

          masterData[masterKey] = masterElements;
          // response
        })

        setMasterData(masterData)
      } catch (error) {
        setObjects([]); // kiürítjük a objektum listát
        //setError(error.statusText); // beállíjuk a hiba állapotát
        console.warn('DataIndexEvent error:', error);
        //addMessage("danger", error.statusText);
      } finally {
        setLoading(false); // kikapcsoljuk a homokórát
      }
    }
  }, [get, languages, masters, url, objects]);

  /*
  const _DataIndexEvent = async (forced = false) => {
    if (objects.length === 0 || forced) {
      console.log("DataIndexEvent", objects);
      // console.log('objects', objects)
      setLoading(true); // bekapcsoljuk a homokórát
      try {

        let promises = [get(url + "?nolang=true")];
        Object.keys(masters).forEach((m) => promises.push(get(masters[m].url + "?nolang=true")))
        const [mainResp, ...otherResps] = await Promise.all(promises);
        //setError(""); // kitöröljük a hibát
        setObjects(mainResp.data); // beállítjuk az objektumok állapotát a válaszban kapott listával
        console.log('objects set', mainResp.data)
        const masterData = {};
        otherResps.forEach((response, idx) => {
          const masterKey = Object.keys(masters)[idx]
          const master = masters[masterKey]

          console.log(masters, idx, master, response.data)
          const masterElements = {};
          response.data.forEach(item => {
            masterElements[item.id] = {}
            languageCodes.forEach(lang => {
              if (item.hasOwnProperty('name_' + lang)) {
                masterElements[item.id][lang] = item['name_' + lang];
              }
            })
            if (item.hasOwnProperty('name')) {
              masterElements[item.id][''] = item['name'];
            }
          });

          masterData[masterKey] = masterElements;
          // response
        })

        setMasterData(masterData)
      } catch (error) {
        setObjects([]); // kiürítjük a objektum listát
        //setError(error.statusText); // beállíjuk a hiba állapotát
        console.warn('DataIndexEvent error:', error);
        //addMessage("danger", error.statusText);
      } finally {
        setLoading(false); // kikapcsoljuk a homokórát
      }
    }
  };
  */

  useEffect(() => {
    // console.log('DataTable useEffect')
    DataIndexEvent();
  }, [DataIndexEvent]); // , [addMessage, get, loading, error, url, objects]

  const DataCreateEvent = (object, saveEvent) => {
    // Megnyitja a formot, betölti egy új objektumot szerkesztésre.
    // A saveEvent azért kell, mert átadunk egy függvényt, aminek le kell futnia,
    //   amikor a mentés gombra kattintanak a formon.

    console.log("DataCreateEvent", object, saveEvent);
    setModalState({
      object: {},
      readOnly: false,
      visible: true,
      saveEvent: DataStoreEvent,
      messages: [],
    });
  };

  const DataShowEvent = (object) => {
    // Megnyitja a formot, betölti a objektumot megtekintésre.

    // console.log("ObjectShowEvent", object);
    setModalState({
      object: object,
      readOnly: true,
      visible: true,
      saveEvent: null,
      messages: [],
    });
  };

  // A saveEvent azért kell, mert átadunk egy függvényt, aminek le kell futnia,
  //   amikor a mentés gombra kattintanak a formon.
  const DataEditEvent = (object, saveEvent) => {
    // Megnyitja a formot, betölti a objektumot szerkesztésre.

    console.log("DataEditEvent", object, saveEvent);
    setModalState({
      object: object,
      readOnly: false,
      visible: true,
      saveEvent: DataUpdateEvent,
      messages: [],
    });
  };

  const DataStoreEvent = (object) => {
    // Elküldi az új objektumot a szervernek.

    console.log("DataStoreEvent", object);
    setLoading(true);
    post(url + "?nolang=true", object)
      .then((response) => {
        console.log(response);
        setError("");
        setObjects([...objects, response]);
      })
      .catch((error) => {
        setError(error.statusText);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const DataUpdateEvent = (object) => {
    // Elküldi a létező objektumot a szervernek.

    console.log("DataUpdateEvent", object);
    setLoading(true);
    put(`${url}/${object.id}?nolang=true`, object)
      .then((response) => {
        const data = response.data;
        console.log('DataUpdateEvent data', data);
        setError("");
        const idx = objects.findIndex((u) => data.id === u.id); // megkeressük a módosított objektum indexét a a listában
        const newObjects = [...objects]; // lemásoljuk a listát
        console.log('csere', idx, data, newObjects[idx]);
        newObjects[idx] = data; // kicseréljük a módosított objektumot az újra.

        console.log('newObjects', newObjects); // újrarenderelünk
        setObjects(newObjects); // újrarenderelünk
      })
      .catch((error) => {
        setError(error.statusText);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const updateObjectList(id, newObj) {

  // }

  const DataDeleteEvent = (object) => {
    // Törli a objektumot.
    // Kellene ide egy megerősítés is a kérés kiküldése előtt.

    console.log("DataDeleteEvent", object);
    setLoading(true);
    deletex(`${url}/${object.id}`)
      .then((response) => {
        console.log(response);
        setError("");
        const idx = objects.findIndex((u) => object.id === u.id); // megkeressük a törölt objektumot
        const newObjects = [...objects]; // lemásoljuk a listát
        newObjects.splice(idx, 1); // kitöröljük a törölt objektumot
        setObjects(newObjects); // újrarenderelelés
      })
      .catch((error) => {
        setError(error.statusText);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Egy objektumba összegyűjtöttük a függvényeket, amiket a lista hívhat, egy tulajdonságként tudjuk így küldeni a props-nak.
  // A függvények referenciáit használjuk, nem hívjuk őket!
  let events = {
    index: DataIndexEvent,
    create: DataCreateEvent,
    store: DataStoreEvent,
    show: DataShowEvent,
    edit: DataEditEvent,
    update: DataUpdateEvent,
    destroy: DataDeleteEvent,
  };

  return (
    <DataContext.Provider value={{ ...props, events, model, objects, masterData, sortCol, sortDir, addSort }}>
      <article>
        <h2>{__(":model list", { 'model': __(model.name) })}</h2>
        {/* az onClick-ben a fenti events objektum create-jét hívjuk */}
        <Button variant="primary" onClick={() => events.create()}>
          {__("New :model", { 'model': __(model.name) })}
        </Button>
        {/* feltétel && ... módon lehet feltételhez kötni a renderelést. Itt: ha van hiba, megjelenik az értesítési sáv. */}
        {error && <Alert variant={"danger"}>{error}</Alert>}
        <Spinner shown={loading} />
        <Table events={events} objects={objects} />
        {modalState && <DataModal state={modalState} setState={setModalState} />}
      </article>
    </DataContext.Provider>
  );
}

function Table(props) {
  return (
    <table className="table data-table">
      <TableHead />
      <TableBody />
    </table>
  );
}

function TableHead() {
  const { __ } = useTranslation();
  const { fields, sortCol, sortDir, addSort } = useData()
  return (
    <thead>
      <tr>
        <th>{__('Actions')}</th>
        {fields.filter((field) => field.displayIn.includes('table')).map((fld, idx) => (
          <th key={idx}
            className={fld.sortable && sortCol === fld.name ? `sortable sort-${sortDir}` : (fld.sortable ? 'sortable' : '')}
            onClick={fld.sortable ? () => addSort(fld.name) : undefined}
          >{__(fld.title)}</th>)
        )}
      </tr>
    </thead>
  );
}

function TableBody() {
  const { objects, sortCol, sortDir, fields } = useData()

  const compareEntries = (a, b) => {
    if (sortCol) {
      const sortField = fields.find((item) => item.name === sortCol)
      if (sortField && sortField.sortable) {
        switch (sortField.dataType) {
          case 'number': return (a[sortCol] - b[sortCol]) * (sortDir === 'asc' ? 1 : -1);
          case 'longstring':
          case 'string':
            return a[sortCol].localeCompare(b[sortCol]) * (sortDir === 'asc' ? 1 : -1);
          default:
            return 0;
        }
      }
    }
    return 0;
  }

  return (
    <tbody>
      {objects.sort((a, b) => compareEntries(a, b)).map((item, i) => (
        <TableRow key={i} object={item} />
      ))}
    </tbody>
  );
}

function TableRow(props) {
  const { fields, events } = useData()
  const { __ } = useTranslation();
  let object = props.object;
  return (
    <tr>
      <td style={{ "whiteSpace": "nowrap" }}>
        <i
          className="fa-solid fa-magnifying-glass"
          onClick={() => {
            events.show(object);
          }}
        ></i>&nbsp;<i
          className="fa-regular fa-pen-to-square"
          onClick={() => {
            events.edit(object, events.update);
          }}
        ></i>&nbsp;<i
          className="fa-regular fa-trash-can"
          onClick={() => {
            events.destroy(object);
          }}
        ></i>
      </td>
      {fields.filter((field) => field.displayIn.includes('table')).map((col, idx) => {
        switch (col.dataType) {
          case 'number':
          case 'string':
          case 'longstring':
            return (<td key={idx}>{object[col.name]}</td>)
          case 'master':
            return (<TableColLookup key={idx} master={col.dataModel} value={object[col.name]}></TableColLookup>)
          case 'boolean':
            const objValue = object[col.name];
            const display = __(col.values[objValue ? 1 : 0])
            return (<td key={idx}>{display}</td>)
          default:
            return (<td key={idx}></td>)
        }
      })}
    </tr>
  );
}

function TableColLookup(props) {
  const { masterData } = useData();
  const { language } = useTranslation();
  const master = masterData[props.master]
  const value = master[props.value][language]
  return <td>{value}</td>
}

export default DataTable;