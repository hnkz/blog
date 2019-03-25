import * as React from 'react';
import './Blog.css';

import { Markdown } from './Markdown';

export interface IBlog {
    title: string;
    tags: string[];
    contents: string;
    timestamp: string;
}
interface IProps {
    blog: IBlog;
}
/*
    anyについて調べる
*/
export class Blog extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    /*
        挙動検証
    */
    public shouldComponentUpdate(nextProps: IProps, nextState: any): boolean {
        return false;
    }

    public render() {
        return (
            <div className="blogItem" key={this.props.blog.timestamp}>
                <h2 className="blogTitle">{this.props.blog.title}</h2>
                <div id="tagarea">
                    {this.props.blog.tags.map((tag, j)=> 
                        <div className="tag" key={j}>
                            {tag}
                        </div>
                    )}
                </div>
                <Markdown contents={this.props.blog.contents} />
                <p className="timestamp">{this.props.blog.timestamp}</p>
            </div>
        );
    }
}