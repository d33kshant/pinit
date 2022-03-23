import '../styles/Pin.css'

const Pin = ({ data: { title, link, author, created_on } }) => {
	return (
		<div className='pin-container'>
			<div onClick={()=>window.open(link)} className="pin-image-container">
				<div className="pin-info">
					by {author}<br />
					on {(new Date(created_on)).toLocaleString()}
				</div>
				<img src={link} alt={title} className="pin-image" />
			</div>
			<span>{title}</span>
		</div>
	)
}

export default Pin