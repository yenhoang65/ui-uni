import InputWithLabel from "../InputWithLabel";
import styles from "./styles.module.css";

type SearchProps = {
    setParPage: (value: number) => void;
    searchValue: string;
    setSearchValue: (value: string) => void;
};

const Search: React.FC<SearchProps> = ({
    setParPage,
    searchValue,
    setSearchValue,
}) => {
    return (
        <div className={styles.wrapper}>
            <select
                onChange={(e) => setParPage(parseInt(e.target.value))}
                className={styles.select}
            >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
            </select>

            <InputWithLabel
                placeholder="Search..."
                name="search"
                value={searchValue}
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    );
};

export default Search;
