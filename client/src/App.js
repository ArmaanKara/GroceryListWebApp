import { useEffect, useState } from 'react';
const api_base = 'http://localhost:3001';

function App() {
	const [lists, setLists] = useState([]);
	const [popupActive, setPopupActive] = useState(false);
	const [newList, setNewList] = useState("");

	useEffect(() => {
		GetLists();
	}, []);

	const GetLists = () => {
		fetch(api_base + '/lists')
			.then(res => res.json())
			.then(data => setLists(data))
			.catch((err) => console.error("Error: ", err));
	}

	const completeList = async id => {
		const data = await fetch(api_base + '/list/complete/' + id).then(res => res.json());

		setLists(lists => lists.map(list => {
			if (list._id === data._id) {
				list.complete = data.complete;
			}

			return list;
		}));
		
	}

	const addList = async () => {
		const data = await fetch(api_base + "/list/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json" 
			},
			body: JSON.stringify({
				text: newList
			})
		}).then(res => res.json());

		setLists([...lists, data]);

		setPopupActive(false);
		setNewList("");
	}

	const deleteList = async id => {
		const data = await fetch(api_base + '/list/delete/' + id, { method: "DELETE" }).then(res => res.json());

		setLists(lists => lists.filter(list => list._id !== data.result._id));
	}

	return (
		<div className="App">
			<h1>Welcome, Kara Family</h1>
			<h4>Family Grocery List</h4>

			<div className="lists">
				{lists.length > 0 ? lists.map(list => (
					<div className={
						"list" + (list.complete ? " is-complete" : "")
					} key={list._id} onClick={() => completeList(list._id)}>
						<div className="checkbox"></div>

						<div className="text">{list.text}</div>

						<div className="delete-list" onClick={() => deleteList(list._id)}>x</div>
					</div>
				)) : (
					<p>You currently have no tasks</p>
				)}
			</div>

			<div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

			{popupActive ? (
				<div className="popup">
					<div className="closePopup" onClick={() => setPopupActive(false)}>X</div>
					<div className="content">
						<h3>Add Task</h3>
						<input type="text" className="add-list-input" onChange={e => setNewList(e.target.value)} value={newList} />
						<div className="button" onClick={addList}>Create Task</div>
					</div>
				</div>
			) : ''}
		</div>
	);
}

export default App;
