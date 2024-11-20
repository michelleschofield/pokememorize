import { FormEvent, useEffect, useState } from 'react';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { shareSet, usernameExists } from '../lib';
import { FaGear } from 'react-icons/fa6';
import { LoadingMessage } from './LoadingMessage';
import { RedMessage } from './RedMessage';
import { GreenMessage } from './GreenMessage';

type Props = {
  studySetId: number;
  onShare: () => void;
};

export function ShareForm({ studySetId, onShare }: Props): JSX.Element {
  const [shareWith, setShareWith] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    async function checkExistence(): Promise<void> {
      try {
        setIsChecking(true);
        const userExists = await usernameExists(shareWith);
        setUserExists(userExists);
      } catch (err) {
        console.error(err);
        alert(err);
      } finally {
        setIsChecking(false);
      }
    }
    checkExistence();
  }, [shareWith]);

  async function handleShare(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      if (!userExists) return;
      const formData = new FormData(event.currentTarget);
      const { username } = Object.fromEntries(formData) as { username: string };
      await shareSet(studySetId, username);
      onShare();
    } catch (err) {
      alert(err);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleShare}>
      <div className="flex items-center">
        <label className="flex">
          <p className="mr-2">Username:</p>
          <TextInput
            required
            onChange={(e) => setShareWith(e.target.value)}
            value={shareWith}
            name="username"
            style={{
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: 'normal',
            }}
          />
        </label>
        <Button disabled={!shareWith || isLoading || !userExists}>
          {isLoading ? <FaGear className="spin" /> : 'Share'}
        </Button>
      </div>
      {shareWith && (
        <>
          {isChecking && (
            <LoadingMessage>Checking if user exists...</LoadingMessage>
          )}
          {!isChecking && !userExists && (
            <RedMessage>User does not exist</RedMessage>
          )}
          {!isChecking && userExists && (
            <GreenMessage>User does exist</GreenMessage>
          )}
        </>
      )}
    </form>
  );
}
