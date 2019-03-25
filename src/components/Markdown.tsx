import * as React from 'react';
import './Markdown.css';

interface IProps {
    contents: string;
}
export class Markdown extends React.Component<IProps, any> {
    private contents: string;
    private key: number;
    constructor(props: IProps) {
        super(props);
        this.contents = this.props.contents;
        this.key = 0;
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: any): boolean {
        return false;
    }

    public render() {
        this.contents = this.props.contents;
        const mdComponents: JSX.Element[] = [];
        while(this.contents.length > 0) {
            mdComponents.push(this.parseMD());
        }

        return (
            <div className="mdComponent">
                { mdComponents }
            </div>
        );
    }


    private parseMD(): JSX.Element {
        // Head
        let regexp = new RegExp("^#+ (.*)\u000a");
        if(regexp.exec(this.contents) !== null) {
            return this.getHead();
        }

        // list
        regexp = new RegExp("^\- (.*)\u000a");
        if(regexp.exec(this.contents) !== null) {
            return this.getList(-1, 0);
        }

        // num list
        regexp = new RegExp("^1\. (.*)\u000a");
        if(regexp.exec(this.contents) !== null) {
            return this.getNumList(-1, 0);
        }

        // code block
        regexp = new RegExp("^```\u000a");
        let result = regexp.exec(this.contents);
        if(result !== null) {
            this.removeContentsFromTop(result[0].length);
            let i = 0;
            const delimitar = "`";
            for(;i + 2 < this.contents.length &&
                (this.contents[i] !== delimitar || this.contents[i+1] !== delimitar || this.contents[i+2] !== delimitar);){ i++ }
            const inner = this.contents.slice(0, i);
            this.removeContentsFromTop(i);
            this.removeContentsFromTop(result[0].length);
            return (<pre key={this.key++}><code className="blockCode" key={this.key++}>{inner}</code></pre>);
        }

        // quote block
        regexp = new RegExp("^>>>\u000a");
        result = regexp.exec(this.contents);
        if(result !== null) {
            this.removeContentsFromTop(result[0].length);
            let i = 0;
            const delimitar = "<";
            for(;i + 2 < this.contents.length &&
                (this.contents[i] !== delimitar || this.contents[i+1] !== delimitar || this.contents[i+2] !== delimitar);){ i++ }
            const inner = this.contents.slice(0, i);
            this.removeContentsFromTop(i);
            this.removeContentsFromTop(result[0].length);
            return (<blockquote key={this.key++}>{this.getDecorator(inner)}</blockquote>);
        }

        // paragragh
        regexp = new RegExp("(.*)\u000a");
        result = regexp.exec(this.contents);
        if(result !== null) {
            this.removeContentsFromTop(result[0].length);
            return (<p key={this.key++}>{this.getDecorator(result[1])}</p>);
        }

        this.contents = "";
        return (<></>);
    }

    private getDecorator(content: string): JSX.Element {
        // inline code
        let regexp = new RegExp("(.*)`(.*)`(.*)");
        let result = regexp.exec(content);
        if(result !== null) {
            return <>{result[1]}<code className="innerCode" key={this.key++}>{result[2]}</code>{result[3]}</>
        }

        // image tag
        regexp = new RegExp("(.*)!\\[(.+)\\]\\((.+)\\)(.*)");
        result = regexp.exec(content);
        if(result != null) {
            return <>{result[1]}<img src={result[3]} alt={result[2]}  key={this.key++} />{result[4]}</>;
        }

        // a tag
        regexp = new RegExp("(.*)\\[(.+)\\]\\((.+)\\)(.*)");
        result = regexp.exec(content);
        if(result != null) {
            return <>{result[1]}<a href={result[3]}  key={this.key++}>{result[2]}</a>{result[4]}</>;
        }

        return <>{content}</>;
    }

    private getList(tab: number, tabUnit: number): JSX.Element {
        let result: RegExpExecArray | null = null;
        const listRegexp = new RegExp("^( *)\- (.*)\u000a");
        result = listRegexp.exec(this.contents);
        if(result !== null) {
            if(tab === -1) {
                this.removeContentsFromTop(result[0].length);
                return (
                    <ul key={this.key++}>
                        <li key={this.key++}>{this.getDecorator(result[2])}</li>
                        {this.getList(0, 0)}
                    </ul>
                );
            } else if(tabUnit === 0 && result[1].length > 0) {
                this.removeContentsFromTop(result[0].length);
                return (
                    <>
                    <ul key={this.key++}>
                        <li key={this.key++}>{this.getDecorator(result[2])}</li>
                        {this.getList(tab+1, result[1].length)}
                    </ul>
                    {this.getList(tab, result[1].length)}
                    </>
                );
            } else if(tabUnit !== 0 && tab < (result[1].length / tabUnit)) {
                this.removeContentsFromTop(result[0].length);
                return (
                    <>
                    <ul key={this.key++}>
                        <li key={this.key++}>{this.getDecorator(result[2])}</li>
                        {this.getList(tab+1, tabUnit)}
                    </ul>
                    {this.getList(tab, tabUnit)}
                    </>
                );
            } else if(tab > (result[1].length / tabUnit)) {
                return <></>;
            } else {
                this.removeContentsFromTop(result[0].length);
                return (
                    <>
                    <li key={this.key++}>{this.getDecorator(result[2])}</li>
                    {this.getList(tab, tabUnit)}
                    </>
                );
            }
        }

        return (<></>);
    }

    private getNumList(tab: number, tabUnit: number): JSX.Element {
        const listRegexp = new RegExp("^( *)([1-9]\.)+ (.*)\u000a");
        const result = listRegexp.exec(this.contents);
        if(result !== null) {
            if(tab === -1) {
                this.removeContentsFromTop(result[0].length);
                return (
                    <ol key={this.key++}>
                        <li key={this.key++}>{this.getDecorator(result[3])}</li>
                        {this.getNumList(0, 0)}
                    </ol>
                );
            } else if(tabUnit === 0 && result[1].length > 0) {
                this.removeContentsFromTop(result[0].length);
                return (
                    <>
                    <ol key={this.key++}>
                        <li key={this.key++}>{this.getDecorator(result[3])}</li>
                        {this.getNumList(tab+1, result[1].length)}
                    </ol>
                    {this.getNumList(tab, result[1].length)}
                    </>
                );
            } else if(tabUnit !== 0 && tab < (result[1].length / tabUnit)) {
                this.removeContentsFromTop(result[0].length);
                return (
                    <>
                    <ol key={this.key++}>
                        <li key={this.key++}>{this.getDecorator(result[3])}</li>
                        {this.getNumList(tab+1, tabUnit)}
                    </ol>
                    {this.getNumList(tab, tabUnit)}
                    </>
                );
            } else if(tab > (result[1].length / tabUnit)) {
                return <></>;
            } else {
                this.removeContentsFromTop(result[0].length);
                return (
                    <>
                    <li key={this.key++}>{this.getDecorator(result[3])}</li>
                    {this.getNumList(tab, tabUnit)}
                    </>
                );
            }
        }

        return (<></>);
    }

    private getHead(): JSX.Element {

        // #
        const headRegexp = new RegExp("^# (.*)\u000a");
        let result = headRegexp.exec(this.contents);
        if(result !== null) {
            this.removeContentsFromTop(result[0].length);
            return (<h1 key={this.key++}>{result[1]}</h1>);
        }

        // ##
        const head2Regexp = new RegExp("^## (.*)\u000a");
        result = head2Regexp.exec(this.contents);
        if(result !== null) {
            this.removeContentsFromTop(result[0].length);
            return (<h2 key={this.key++}>{result[1]}</h2>);
        }

        // ###
        const head3Regexp = new RegExp("^### (.*)\u000a");
        result = head3Regexp.exec(this.contents);
        if(result !== null) {
            this.removeContentsFromTop(result[0].length);
            return (<h3 key={this.key++}>{result[1]}</h3>);
        }

        // ####
        const head4Regexp = new RegExp("^#### (.*)\u000a");
        result = head4Regexp.exec(this.contents);
        if(result !== null) {
            this.removeContentsFromTop(result[0].length);
            return (<h4 key={this.key++}>{result[1]}</h4>);
        }

        // #####
        const head5Regexp = new RegExp("^##### (.*)\u000a");
        result = head5Regexp.exec(this.contents);
        if(result !== null) {
            this.removeContentsFromTop(result[0].length);
            return (<h5 key={this.key++}>{result[1]}</h5>);
        }


        // ######
        const head6Regexp = new RegExp("^###### (.*)\u000a");
        result = head6Regexp.exec(this.contents);
        if(result !== null) {
            this.removeContentsFromTop(result[0].length);
            return (<h6 key={this.key++}>{result[1]}</h6>);
        }

        return (<div>nothing</div>);
    }

    private removeContentsFromTop(len: number) {
        this.contents = this.contents.slice(len);
    }
}