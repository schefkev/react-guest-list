import './App.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';

/* const layoutStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
`; */
const divContainerFlex = css`
  display: flex;
`;

const divFloatLeft = css`
  flex: 1;
  background-color: beige;
  display: flex;
  justify-content: center;
`;

const divFloatRight = css`
  display: flex;
  flex: 2;
  justify-content: center;
  background-color: aliceblue;
  ul {
    margin-top: 16px;
    list-style: none;
    display: block;
  }
  button {
    margin-top: 12px;
  }
`;

const divFloatCenter = css`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const listPaddingStyles = css`
  padding-left: 25px;
`;

const borderBoxStyles = css`
  border: 4px solid #000;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 300px;
  height: 80px;
`;

const textStyles = css`
  padding-left: 40px;
`;

export default function GuestList() {
  const [guests, setGuests] = useState([]); // This is the GUEST LIST
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true); // This is the state for the loader to show message on Loading
  const [isDisabled, setIsDisabled] = useState(true); // This is the state for the Disabling of the form field

  /* BASE URL */
  const baseUrl =
    'https://express-guest-list-api-memory-data-store-1.schefkev.repl.co';

  /* FETCHING THE API */
  const getAllGuest = async () => {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuests(allGuests);
    setLoading(false); // Updating the loading to false once api is fetched
    setIsDisabled(false); // Updating the disabled to false once api is fetched
    console.log('fetching the guest list');
  };

  /* FETCHING THE GUEST LIST => THE EMPTY ARRAY ENSURES THAT THE
    EFFECT ONLY RUNS ONCE, WHEN THE COMPONENT IS FIRST RENDERED*/

  useEffect(() => {
    getAllGuest().catch(() => {
      console.log('fetching all the guests went terribly wrong');
    });
  }, []);

  /* CREATING A NEW GUEST
    PASSING THE SPREAD OPERATOR AND CREATEDGUEST => THIS
    UPDATES THE STATE TO INCLUDE THE NEWLY CREATED GUEST*/
  const addNewGuest = async (e) => {
    e.preventDefault();
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const createdGuest = await response.json();
    console.log(createdGuest);
    setGuests([...guests], createdGuest);
    getAllGuest().catch(() =>
      console.log('adding the new guest to the array went wrong'),
    );
    setFirstName(''); // TO RESET THE FIRST NAME INPUT FIELD
    setLastName(''); // TO RESET THE LAST NAME INPUT FIELD
  };

  /* UPDATING A GUEST / ATTENDING STATUS*/
  const updateGuestAttendingStatus = async (id, value) => {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !value }),
    });
    const updatedGuest = await response.json();
    /* This checks the id of each element of the array to not be equal to the
      id of updatedGuest and creates a new array with all the elements that pass the test */
    const updatedGuestList = guests.filter((i) => {
      return i.id !== updatedGuest.id;
    });
    setGuests([...guests], updatedGuestList);
    getAllGuest().catch(() => {
      console.log('updating the attendance went south');
    });
  };

  /* DELETING A GUEST FROM THE ARRAY */
  const deleteGuest = async (id) => {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    /* Checks id the id of each element of the array is not equal to the id
      of deletedGuest and creates a new array with all the elements that pass the test*/
    const newGuestList = guests.filter((i) => {
      return i.id !== deletedGuest.id;
    });
    setGuests(newGuestList);
    getAllGuest().catch(() =>
      console.log('deleting from the array went miserably wrong'),
    );
  };

  return loading ? (
    <>
      <h1>Loading...</h1>
      <form disabled={isDisabled} />
    </>
  ) : (
    <div css={divContainerFlex}>
      <h1 css={divFloatCenter}>Guest List</h1>
      <div css={divFloatLeft} className="main-content">
        <div>
          <h2>Add a New Guest to the List:</h2>
          <form name="form" onSubmit={addNewGuest}>
            <label>
              First name
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
              />
            </label>
            <br />
            <label>
              Last name
              <input
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
              />
            </label>
            <br />
            <div className="btn-container">
              <button onClick={addNewGuest}>ADD NEW GUEST</button>
            </div>
          </form>
        </div>
      </div>
      {/* MAPPING OVER THE GUEST LIST ARRAY
          OPT: SHOWING IF THE GUEST LIST IS EMPTY */}
      <div css={divFloatRight}>
        {guests.length === 0 ? (
          <div className="no-guests">Your Guest List is EMPTY:</div>
        ) : (
          <div>
            <h2>GUESTS:</h2>
            {guests.map((list) => {
              return (
                <div css={borderBoxStyles} key={list.id} data-test-id="guest">
                  <ul>
                    <li>
                      <div css={textStyles}>
                        {list.firstName} {list.lastName}
                      </div>
                      {/* DELETE GUEST SECTION WITH BUTTON */}
                      <button
                        aria-label={`Remove ${list.firstName} ${list.lastName}`}
                        onClick={() => {
                          deleteGuest(list.id).catch(() =>
                            console.log(
                              'Removing the guest from the list was not successful',
                            ),
                          );
                        }}
                      >
                        Remove
                      </button>
                      {/* ATTENDANCE CHECKBOX */}
                      <label css={listPaddingStyles}>
                        <input
                          aria-label={`${list.firstName} ${list.lastName} attending status`}
                          type="checkbox"
                          checked={list.attending}
                          onChange={() => {
                            updateGuestAttendingStatus(
                              list.id,
                              list.attending,
                            ).catch(() =>
                              console.log(
                                'updating the attendance status went south',
                              ),
                            );
                          }}
                        />
                        {list.attending === true
                          ? 'attending'
                          : 'not attending'}
                      </label>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
