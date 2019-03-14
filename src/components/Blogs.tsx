import * as React from 'react';
import './Blogs.css';

export interface IBlog {
    title: string;
    tags: string[];
    content: string;
    timestamp: string;
}
interface IProps {
    blogs: IBlog[];
}
export class Blogs extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div id="contents">
            {this.props.blogs.map((data, i) => {
                return (
                    <div className="blogItem" key={i}>
                        <h2>{data.title}</h2>
                        <div id="tagarea">
                            {data.tags.map((tag, j)=> 
                                <div className="tag" key={j}>
                                    {tag}
                                </div>
                            )}
                        </div>
                        <p className="text">{data.content}</p>
                        <p className="timestamp">{data.timestamp}</p>
                    </div>
                );
            })}
            </div>
        );
    }
}