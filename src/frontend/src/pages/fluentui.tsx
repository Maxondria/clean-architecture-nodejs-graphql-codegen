import * as React from 'react';

import LeftNav from '../components/LeftNav';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';

import styles from './fluentui.module.scss';
import { useGetUserTodosQuery, Todo } from '../generated/graphql-client';

const LeftPane = () => (
  <div className={styles.left}>
    <LeftNav />
  </div>
);

type MainPaneProps = {
  todos: Todo[];
};

const MainPane: React.FC<MainPaneProps> = ({ todos }) => (
  <div className={styles.main}>
    <div className={styles.wrap}>
      <TodoList todos={todos.map((t) => t.title)} />
      <AddTodo onSubmit={(title) => alert(title)} />
    </div>
  </div>
);

type IndexProps = {
  todos: Todo[];
};

const Index: React.FC<IndexProps> = ({ todos }) => (
  <div className="ms-Grid" dir="ltr">
    <div className="ms-Grid-row">
      <div className="ms-Grid-col ms-sm3">
        <LeftPane />
      </div>
      <div className="ms-Grid-col ms-sm9">
        <MainPane todos={todos} />
      </div>
    </div>
  </div>
);

const IndexPage: React.FC = () => {
  const data = useGetUserTodosQuery({ variables: { id: '1' } });

  const { user } = data?.data || {};
  if (!user) return null;

  return <Index todos={user?.todos} />;
};

export default IndexPage;
