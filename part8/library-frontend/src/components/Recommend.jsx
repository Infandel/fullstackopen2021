import React from 'react';

const Recommend = ({ show, loading, favoriteGenre, recomendBooks }) => {

  if (!show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>Recommendations</h2>
      {favoriteGenre !== '' ?
        <p>Books in your favorite genre <strong>{favoriteGenre}</strong></p>
        : null
      }
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {recomendBooks.map(b =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;