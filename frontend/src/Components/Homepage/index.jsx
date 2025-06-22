import React from "react";
import HomeBanner from "./Pages/firstPage";

class HomePage extends React.PureComponent {
    render () {
        return (
            <div className="homePage">
                <HomeBanner />
            </div>
        )
    }
}

export default HomePage;
