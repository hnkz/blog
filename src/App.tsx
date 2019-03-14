import * as React from 'react';
import './App.css';
import './Common.css';
import { Blogs, IBlog } from './components/Blogs';

interface IState {
    blogs: IBlog[];
    selected: IBlog[];
}
interface IMessageInputEvent extends React.FormEvent<HTMLInputElement> {
  target: HTMLInputElement;
}

class App extends React.Component<{}, IState> {
  constructor(props: {}) {
		super(props);
    this.state = { blogs: [], selected: []};

    this.handleFilterBlog = this.handleFilterBlog.bind(this);
  }

  public componentDidMount() {
    fetch('http://localhost:8000/blogs')
      .then(response => response.json())
      .then(data => {
        this.setState({blogs: data});
        this.setState({selected: data});
      }
    );
  }

  public handleFilterBlog(e: IMessageInputEvent) {
    if(e.target.value.startsWith("content:"))
    {
      const searchWord = e.target.value.replace(/^content:/g, '');
      const selectedBlog = this.state.blogs.filter((blog) => {
        return blog.content.toLowerCase().search(searchWord.toLowerCase()) !== -1;
      });
      this.setState({selected: selectedBlog});
    } 
    else if(e.target.value.startsWith("tag:"))
    {
      const searchWord = e.target.value.replace(/^tag:/g, '');
      const selectedBlog = this.state.blogs.filter((blog) => {
        const flag: string[] = blog.tags.filter((tag: string) => {
          return tag.toLowerCase().search(searchWord) !== -1;
        });
        return flag.length > 0;
      });
      this.setState({selected: selectedBlog});
    }
    else if(e.target.value.startsWith("date:"))
    {
      const searchWord = e.target.value.replace(/^date:/g, '');
      const selectedBlog = this.state.blogs.filter((blog) => {
        return blog.timestamp.toLowerCase().search(searchWord.toLowerCase()) !== -1;
      });
      this.setState({selected: selectedBlog});
    } else {
      this.setState({selected: this.state.blogs});
    }
  }
  
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Sugerme Daily</h1>
          <p>This blog is a rubbish heap to store my thoughts. If I feel like it, I will update (^o^).</p>
          <input id="searchInput" type="text" placeholder="search (e.g. content:{}, tag:{}, date:{})" onChange={this.handleFilterBlog}/>
        </header>
        <Blogs blogs={this.state.selected} />
      </div>
    );
  }
}

export default App;
