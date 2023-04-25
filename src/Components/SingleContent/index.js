import React from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'

export default function SingleContent({ data, type }) {
  const history = useHistory()
  return (
    <img
      src={data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
      alt={data.title}
      className="poster"
      onClick={() => history.push(`/singlecontent/${data.id}/${type ? type : data.media_type}`)}
    />
  )
}
