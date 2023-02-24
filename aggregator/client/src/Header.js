import React from 'react';

class Header extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="head">
                    <div className="headerobjectswrapper">
                        {/* <div className="weatherforcastbox">
                            <span style={{ fontStyle: 'italic' }}>Weather forcast for the next 24 hours: Plenty of Sunshine</span><br />
                            <span>Wind: 7km/h SSE; Ther: 21°C; Hum: 82%</span>
                        </div> */}
                        <h1>FrontPage</h1>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Header;