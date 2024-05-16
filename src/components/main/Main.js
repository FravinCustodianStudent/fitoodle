
import "./main.scss";
import SearchInput from "./inputs/SearchInput";
import Task from "./task/task";
const Main = () => {
    return(
        <div className="main">
            <div className="main__name">
                <h1>
                    Добрий день, <a href="">USERNAME</a>
                </h1>
            </div>
            <div className="main__content">
                <div className="main__content__tasks">
                    <div className="main__content__tasks__info">
                        <div className="main__content__tasks__info__name">
                            <div className="main__content__tasks__info__name__text">Завдання</div>
                            <div className="main__content__tasks__info__name__count">3</div>
                        </div>

                        <div className="main__content__tasks__info__search">
                            <SearchInput></SearchInput>
                        </div>
                    </div>
                    <div className="main__content__tasks__list">
                        <Task></Task>
                        <Task></Task>
                        <Task></Task>
                        <Task></Task>
                        <Task></Task>
                        <Task></Task>
                        <Task></Task>
                        <Task></Task>
                        <Task></Task>
                        <Task></Task>
                        <Task></Task>
                        <Task></Task>
                    </div>
                </div>
                <div className="main__content__schedule"></div>
            </div>

        </div>
    )
}
export default Main;