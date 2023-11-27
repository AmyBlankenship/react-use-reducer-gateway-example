import {Friend} from "../App.tsx";
import {useReducerGateway} from "@amy_blankenship/react-use-reducer-gateway";
import {FC, SyntheticEvent, useCallback} from "react";
import PetEditor from "./PetEditor.tsx";

type Props = {
  friend: Friend
  saveFriend: (friend: Friend) => void
  deleteFriend: () => void
}

type EditableFriend = Omit<Friend, 'id'>

const FriendEditor: FC<Props> = ({friend, saveFriend, deleteFriend}) => {
  const {value,
    isChanged,
    getInputHandlerFor,
    initialize,
    update
  } = useReducerGateway<EditableFriend>(friend)

  const onSubmit = useCallback((e: SyntheticEvent) => {
    e.preventDefault()
    saveFriend(value as Friend)
  }, [value, saveFriend]);

  const reset = useCallback(() => {
    initialize(friend)
  }, [friend]);

  const updatePet = useCallback((pet: Friend['pet']) => {
    update('pet', pet)
  }, [update]);

  return (
    <form className="edit-friend" onSubmit={onSubmit}>
      <h2>Edit friend</h2>
      <label htmlFor="firstName">First Name:</label>
        <input type="text" name="firstName" id="firstName"
               value={value.firstName}
               onChange={getInputHandlerFor('firstName')}
        />
      <label htmlFor="lastName">Last Name:</label>
        <input type="text" name="lastName" id="lastName"
               value={value.lastName}
               onChange={getInputHandlerFor('lastName')}
        />
      <label htmlFor="phone">Phone:</label>
        <input type="tel" name="phone" id="phone"
               value={value.phone}
               onChange={getInputHandlerFor('phone')}
        />
      <label htmlFor="rating">Rating:</label>
        <input type="range"
               name="rating"
               id="rating"
               list="ratings"
               onChange={getInputHandlerFor('rating')}
               min="1" max="5"
               value={value.rating}
        />

      <div className="edit-friend-pet">
        <h3>Pet:</h3>
        <PetEditor pet={value.pet} updatePet={updatePet} />
      </div>

      <div className="edit-friend-controls">
        <button disabled={!isChanged}>Save</button>
        <button disabled={!isChanged} type="button" onClick={reset}>Reset</button>
        <button type="button" onClick={deleteFriend}>Delete</button>
      </div>

      <datalist id="ratings">
        <option value="1" label="1"></option>
        <option value="2" label="2"></option>
        <option value="3" label="3"></option>
        <option value="4" label="4"></option>
        <option value="5" label="5"></option>
      </datalist>
    </form>
  );
}

export default FriendEditor