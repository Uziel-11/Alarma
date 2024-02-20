import React from "react";
import Card from "../components/card";
import Navbar from "../components/Header";


class Home extends React.Component{
    render() {
        return(
            <>
                <Navbar/>

                <br/>

                <Card/>
            </>
        )
    }
}

export default Home;