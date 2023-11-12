import { useLiveQuery } from 'dexie-react-hooks'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { db } from '../db'

export default function Home() {

    function resetInputs() {
        setInputs({
            name: ""
        })
    }
    const subjects = useLiveQuery(() =>
        db.subjects.toArray()
    )

    const [inputs, setInputs] = useState({
        name: ""
    })

    function handleChange(e) {
        e.persist()
        setInputs((inputs) => ({ ...inputs, [e.target.name]: e.target.value }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (inputs.name != "")
            db.subjects?.add(inputs).then(res => {
                Swal.fire("Success", `Subject Created successfully with id ${res}`, "success")
                resetInputs()
            }).catch(err => {
                Swal.fire("Error", err, "error")
            })
    }

    function deleteItem(id) {
        db.subjects.delete(id).then(res => {
            Swal.fire("Success", "Subject Deleted successfully", "success")
        }).catch(err => {
            Swal.fire("Error", err, "error")
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input type="text" name="name" placeholder='name' onChange={handleChange} value={inputs.name} className='' />
                <button type='submit' className="" >Create</button>
            </form>
            <div className='flex flex-col'>
                {subjects?.map((subject) =>
                    <div key={subject.id} className="flex gap-4"><Link to={`/${subject.id}`}>{subject.name}</Link>
                        <button onClick={() => deleteItem(subject.id)}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    )
}
