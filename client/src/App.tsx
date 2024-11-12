import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { UserProvider } from './components/UserContext';
import { SignUpForm } from './pages/SignUpForm';
import { SignInForm } from './pages/SignInForm';
import { StudySets } from './pages/StudySets';
import { SpecificSet } from './pages/SpecificSet';
import { CardEditor } from './pages/CardEditor';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="sign-up" element={<SignUpForm />} />
          <Route path="sign-in" element={<SignInForm />} />
          <Route path="study-sets" element={<StudySets />} />
          <Route path="study-sets/:studySetId" element={<SpecificSet />} />
          <Route path="study-sets/card/:cardId" element={<CardEditor />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
