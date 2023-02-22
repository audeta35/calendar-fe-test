import logo from './logo.svg';
import './App.css';
import {
  Fragment,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import randomColor from 'randomcolor';
import Toast from './component/Alert';

const day = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const color = randomColor();

function App() {
  // env
  // const url = 'https://calendar-json-api.up.railway.app/'
  const url = 'http://localhost:3002/';
  const date = new Date();
  const minYear = date.getFullYear();
  const maxYear = date.getFullYear() + 5;

  const [isLoading, setIsLoading] =
    useState(true);
  const [months, setMonths] = useState({});
  const [years, setYears] = useState([]);
  const [modalYears, setModalYears] =
    useState(false);
  const [modalMonth, setModalMonth] =
    useState(false);
  const [modalDate, setModalDate] =
    useState(false);
  const [chooseYear, setChooseYear] = useState(
    date.getFullYear()
  );
  const [chooseMonth, setChooseMonth] = useState(
    month[date.getMonth()]
  );

  const [payload, setPayload] = useState({
    month: chooseMonth,
    date: 0,
    year: chooseYear,
    note: '',
    email: '',
    color: color,
    hour: "00",
    minute: "00",
    format: "AM"
  });

  const [calendarEvent, setCalendarEvent] = useState([]);

  const toggleModalYear = () =>
    setModalYears(!modalYears);

  const toggleModalMonth = () =>
    setModalMonth(!modalMonth);

  const toggleModalDate = (row) => {
    setPayload({
      ...payload,
      date: row ? row : 0,
    });
    setModalDate(!modalDate);
  };

  const submitYear = (year) => {
    setChooseYear(year);
    toggleModalYear();
  };

  const submitMonth = (month) => {
    setChooseMonth(month);
    toggleModalMonth();
  };

  const setMinMaxYears = () => {
    let i;
    let arrYears = [];
    setYears([]);

    for (i = minYear; i <= maxYear; i++) {
      // console.log('year: ', i)
      arrYears.push(i);
    }

    setYears(arrYears);
  };

  const getCurrentMonth = async () => {
    setIsLoading(true);
    axios
      .get(
        `${url}month/${chooseMonth}?year=${chooseYear}`
      )
      .then((res) => {
        // console.log('data', res.data);
        setMonths(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        // console.log('months', months.February);
        setIsLoading(false);
      });
  };

  const onChangePayload = (e, type) => {
    // console.log('e', e.target.value);
    // console.log('type', type);

    setPayload({
      ...payload,
      [type]: e.target.value,
    });
  }

  const submitPayload = () => {
    const oldEvent = JSON.parse(
      window.localStorage.getItem('event')
    ) || []

    const arr = oldEvent.length ? [
      ...oldEvent,
    ] : []

    arr.push(payload)

    window.localStorage.setItem('event', JSON.stringify(arr))
    setCalendarEvent(
      JSON.parse(
        window.localStorage.getItem('event')
      )
    );
    Toast.fire({
      icon: 'success',
      title: 'berhasil buat postingan',
    });

    setModalDate(!modalDate)
    setPayload({
      month: chooseMonth,
      date: 0,
      year: chooseYear,
      note: '',
      email: '',
      color: color,
      hour: '00',
      minute: '00',
      format: 'AM',
    });
  }

  useEffect(() => {
    getCurrentMonth();
    setMinMaxYears();
    setCalendarEvent(
      JSON.parse(
        window.localStorage.getItem('event')
      )
    );
  }, [chooseMonth, chooseYear]);

  return (
    <div className='container'>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <Fragment>
          <div className='d-grid gap-2 my-2'>
            <button
              className='btn btn-outline-danger'
              type='button'
              onClick={toggleModalYear}
            >
              {months && months.year}
            </button>
          </div>

          <Modal
            isOpen={modalYears}
            toggle={toggleModalYear}
            scrollable={true}
          >
            <ModalBody>
              <div className='row'>
                {years &&
                  years.map((row, index) => (
                    <div
                      key={index}
                      className='col'
                    >
                      <button
                        className={`btn btn-outline ${
                          row === chooseYear
                            ? 'btn-danger'
                            : 'btn-outline-danger'
                        } m-1`}
                        onClick={() =>
                          submitYear(row)
                        }
                      >
                        {row}
                      </button>
                    </div>
                  ))}
              </div>
            </ModalBody>
          </Modal>

          <Modal
            isOpen={modalMonth}
            toggle={toggleModalMonth}
            scrollable={true}
          >
            <ModalBody>
              <div className='row'>
                {month &&
                  month.map((row, index) => (
                    <div
                      key={index}
                      className='col'
                    >
                      <div className='d-grid gap-2 my-2'>
                        <button
                          className={`btn btn-outline ${
                            row === chooseMonth
                              ? 'btn-danger'
                              : 'btn-outline-danger'
                          } m-1`}
                          onClick={() =>
                            submitMonth(row)
                          }
                        >
                          {row}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </ModalBody>
          </Modal>

          <Modal
            isOpen={modalDate}
            toggle={() =>
              setModalDate(!modalDate)
            }
            scrollable={true}
          >
            <ModalHeader>
              <b>
                Add event on {payload.date}{' '}
                {payload.month} {payload.year}
              </b>
            </ModalHeader>
            <ModalBody>
              <div className='row'>
                <div className='col-12'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='event name'
                    value={payload.note}
                    onChange={(e) =>
                      onChangePayload(e, 'note')
                    }
                  />
                </div>
                <div className='col-12 mt-2'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='email sender'
                    value={payload.email}
                    onChange={(e) =>
                      onChangePayload(e, 'email')
                    }
                  />
                </div>
                <div className='col-12 mt-2'>
                  <div className='row'>
                    <div className='col-4'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='hours'
                        value={payload.hour}
                        onChange={(e) =>
                          onChangePayload(
                            e,
                            'hour'
                          )
                        }
                      />
                    </div>
                    <div className='col-4'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='minute'
                        value={payload.minute}
                        onChange={(e) =>
                          onChangePayload(
                            e,
                            'minute'
                          )
                        }
                      />
                    </div>
                    <div className='col-4'>
                      <select className='form-select' onChange={(e) => onChangePayload(e, 'format')}>
                        <option selected={payload?.format === "AM"} value={"AM"}>AM</option>
                        <option selected={payload?.format === "PM"} value={"PM"}>PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <button
                className='btn'
                onClick={() =>
                  setModalDate(!modalDate)
                }
              >
                cancel
              </button>
              <button className='btn' onClick={() => submitPayload()}>add</button>
            </ModalFooter>
          </Modal>

          <table className='table table-bordered table-lg table-striped table-responsive'>
            <thead className='bg-danger text-white'>
              <tr>
                <th colSpan={7}>
                  <h5
                    onClick={toggleModalMonth}
                    className='text-center'
                  >
                    <b>
                      {months &&
                        Object.keys(months)[0]}
                    </b>
                  </h5>
                </th>
              </tr>
              <tr>
                {day.map((rows) => (
                  <th scope='col'>{rows}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {months &&
                months[
                  Object.keys(months)[0]
                ].map((data) => (
                  <tr className='col'>
                    {data.map((row) => (
                      <td
                        onClick={() => {
                          row > 0 &&
                            toggleModalDate(row);
                        }}
                        className={
                          row ===
                            date.getDate() &&
                          chooseMonth ===
                            month[
                              date.getMonth()
                            ] &&
                          chooseYear ===
                            date.getFullYear()
                            ? 'text-danger'
                            : null
                        }
                      >
                        {row > 0 && (
                          <div className='row'>
                            <div className='col-2'>
                              <b>{row}</b>
                            </div>
                            <div className='col-10'>
                              <div className='row'>
                                {calendarEvent &&
                                  calendarEvent.map(
                                    (
                                      data,
                                      index
                                    ) =>
                                      data.date ===
                                        row &&
                                      data.month ===
                                        chooseMonth &&
                                      data.year ===
                                        chooseYear ? (
                                        <div className='col-12'>
                                          <p
                                            style={{
                                              backgroundColor:
                                                data.color,
                                            }}
                                            className={`text-white p-1`}
                                          >
                                            {data.hour +
                                              `:` +
                                              data.minute +
                                              ` ` + data.format +
                                              ` | ` +
                                              data.note +
                                              ` | ` +
                                              data.email}
                                          </p>
                                        </div>
                                      ) : null
                                  )}
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </Fragment>
      )}
    </div>
  );
}

export default App;
