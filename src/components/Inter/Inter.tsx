import Input from "../Input/Input";

export default async function Inter() {
  const otherPromise = new Promise<string>((resolve) => {
    const random = Math.random();
    return resolve(random.toString());
  });

  const otherPromiseValue = await otherPromise;

  console.log(otherPromiseValue);

  return (
    <div>
      <Input initialValue={otherPromiseValue} />
    </div>
  );
}
