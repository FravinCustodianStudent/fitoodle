import Header from "../header/header";
import {Outlet} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundry from "../error/ErrorBoundry";

const Layout = () => {
    return(
        <div className="app">
            <Header></Header>
            <ErrorBoundary FallbackComponent={<ErrorBoundry/>}>
                <Outlet />
            </ErrorBoundary>

        </div>
    )
}
export default Layout;