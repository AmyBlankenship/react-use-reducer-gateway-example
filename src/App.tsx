import {MouseEvent, useCallback, useState} from 'react'
import './App.css'
import FriendEditor from "./components/FriendEditor.tsx";

export type Friend = {
  firstName: string
  lastName: string
  phone: string
  rating: number,
  id: number,
  pet: {
    species: 'dog' | 'cat' | 'rabbit' | 'snake' | null
    name: string
    gender: 'male' | 'female' | 'nonbinary' | null
  }
}
const getNewFriend = (id: number): Friend => ({
  firstName: '',
  lastName: '',
  phone: '',
  rating: 1,
  id,
  pet: {
    species: null,
    name: '',
    gender: null
  }
})

const petToString = (pet: Friend['pet']) => {
  if (!pet.name) return ''
  if (!pet.gender && !pet.species) return pet.name
  if (pet.gender && pet.species) {
    return `${pet.name} (${pet.gender} ${pet.species})`
  }
  return `${pet.name} (${pet.gender || pet.species})`
}

function App() {
  const [nextId, setNextId] = useState(1)
  const [editingFriendIndex, setEditingFriendIndex] = useState(0)
  const [friendsList, setFriendsList] = useState([getNewFriend(0)])

  const unfriend = useCallback(() => {
    setFriendsList(list => list.filter((_friend, i) => i!==editingFriendIndex))
    setEditingFriendIndex(Math.max(editingFriendIndex - 1, 0))
  }, [editingFriendIndex]);

  const saveFriend = useCallback((friend: Friend) => {
    setFriendsList(list => list.map(item => item.id === friend.id ? friend : item))
  }, [editingFriendIndex, friendsList]);

  const addFriend = useCallback(() => {
    const friend = getNewFriend(nextId)
    setEditingFriendIndex(friendsList.length)
    setFriendsList((friends) => [...friends, friend])
    setNextId(nextId + 1)
  }, [nextId, editingFriendIndex, friendsList]);

  const selectFriend = useCallback((e: MouseEvent<HTMLElement>) => {
    const indexAttr = e.currentTarget.getAttribute('data-edit-index')
    setEditingFriendIndex(Number(indexAttr))
  }, []);

  return (
    <>
      <h1>react-use-reducer-gateway-example</h1>
      <div className="friends">
        <ul className="friend-list">
          {
            friendsList.map((friend, i) => {
              const petDescription = petToString(friend.pet)

              return (
                <li className="friend-card"
                    key={friend.id}
                    data-edit-index={i}
                    onClick={selectFriend}
                >
                  <dl>
                    <dt>Name:</dt>
                    <dd>{friend.firstName} {friend.lastName}</dd>
                    <dt>Phone:</dt>
                    <dd>{friend.phone}</dd>
                    <dt>Rating:</dt>
                    <dd>{friend.rating}</dd>
                    {petDescription &&
                      (<>
                        <dt>Pet:</dt>
                        <dd>{petToString(friend.pet)}</dd>
                      </>)
                    }
                  </dl>
                </li>
              )
            })
          }
        </ul>
        <div className="manage-friends">
          <button onClick={addFriend} type="button">Add Friend</button>
        </div>
      </div>
      {friendsList.length > 0 && (<FriendEditor
        friend={friendsList[editingFriendIndex]}
        saveFriend={saveFriend}
        deleteFriend={unfriend}
      />)}
    </>
  )
}

export default App
