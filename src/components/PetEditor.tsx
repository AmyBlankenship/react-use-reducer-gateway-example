import {Friend} from "../App.tsx";
import {useReducerGateway} from "@amy_blankenship/react-use-reducer-gateway";
import {ChangeEvent, useCallback, useEffect} from "react";

type Props = {
  pet: Friend['pet'],
  updatePet: (pet: Friend['pet']) => void
}

const options = {
  species: [
      null,
      'dog',
      'cat',
      'rabbit',
      'snake',
    ] as const,
  gender: [
    null,
    'male',
    'female',
    'nonbinary'
  ] as const
}

const capitalize = (val: string | null) => {
  if (!val) return 'Select...'
  const [initial, ...rest] = val;
  return (initial.toUpperCase() + rest.join(''));
}


export default function PetEditor({pet, updatePet}: Props) {
  const {value, isChanged, getInputHandlerFor, update} = useReducerGateway(pet)

  useEffect(() => {
    if (isChanged) updatePet(value)
  }, [value, isChanged]);

  const updateSpecies = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = e.currentTarget.selectedIndex
    update('species', options.species[selectedIndex])
  }, []);
  const updateGender = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = e.currentTarget.selectedIndex
    update('gender', options.gender[selectedIndex])
  }, []);


  return (<div className="pet-editor">
    <label><span>Name</span>
      <input
        type="text"
        id="name"
        name="name"
        autoComplete="nope"
        value={value.name}
        onChange={getInputHandlerFor('name')}
      />
    </label>
    <label><span>Species</span>
      <select name="species" id="species"
              onChange={updateSpecies}
              defaultValue={value.species || undefined}
      >
        {options.species.map(option => (
          <option value={option || ''}
            key={option || 'key'}
          >
            {capitalize(option)}
          </option>
        ))}
      </select>
    </label>
    <label><span>Gender</span>
      <select name="gender" id="gender"
              onChange={updateGender}
              defaultValue={pet.gender || undefined}
      >
        {options.gender.map(option => (
          <option value={option || ''}
            key={option || 'key'}
          >
            {capitalize(option)}
          </option>
        ))}
      </select>
    </label>
  </div>);
}