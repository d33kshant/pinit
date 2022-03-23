import { useEffect, useState } from 'react'
import Masonry from 'react-masonry-css'
import AppBar from './components/AppBar'
import Pin from './components/Pin'
import './styles/App.css'

function App() {
	
	const [pins, setPins] = useState([])
	const [query, setQuery] = useState('')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const search = query ? `search=${query.replace(' ', '%20')}` : ''

		fetch(`/api/pin?limit=20&${search}`).then(res=>res.json())
		.then(res => {
			if (res.error) {
				return alert(res.error)
			}
			setPins(res)
			setLoading(false)
		})
	}, [query])

	return (
		<div className='app'>
			<AppBar searchValue={query} onSearchValueChange={(event)=>setQuery(event.target.value)} />
			{
				loading ?
				'Loading...' :
				pins.length <= 0 ?
				'No pins found' :
				<Masonry
					breakpointCols={{
						default: 6,
						768: 4,
						430: 2,
					}}
					className="pins-grid"
					columnClassName="pins-grid-column">
					{ pins.map(pin=><Pin data={pin} />) }
				</Masonry>
			}
		</div>
	)
}

export default App
