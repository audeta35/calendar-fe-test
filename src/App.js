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

function App() {
  // env
  // const url = 'https://calendar-json-api.up.railway.app/'
  const url = 'http://localhost:3002/';
  const date = new Date();
  const minYear = date.getFullYear() - 50;
  const maxYear = date.getFullYear() + 50;

  const [isLoading, setIsLoading] =
    useState(true);
  const [months, setMonths] = useState({});
  const [years, setYears] = useState([]);
  const [modalYears, setModalYears] =
    useState(false);
  const [modalMonth, setModalMonth] =
    useState(false);
  const [chooseYear, setChooseYear] = useState(
    date.getFullYear()
  );
  const [chooseMonth, setChooseMonth] = useState(
    month[date.getMonth()]
  );

  const toggleModalYear = () =>
    setModalYears(!modalYears);

  const toggleModalMonth = () =>
    setModalMonth(!modalMonth);

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

    for (i = minYear; i < maxYear; i++) {
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
        console.log('data', res.data);
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

  useEffect(() => {
    getCurrentMonth();
    setMinMaxYears();
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

          <table className='table table-bordered table-large'>
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
                  <tr>
                    {data.map((row) => (
                      <td>{row > 0 && row}</td>
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
