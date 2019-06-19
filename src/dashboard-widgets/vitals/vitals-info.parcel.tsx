import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import dayjs from "dayjs";

function VitalsInfoParcel(props: VitalsInfoParcelProps) {
  const [vitals, setVitals] = React.useState(null);
  let response;
  const order = "desc";
  const limit = 1;
  const encType = "67a71486-1a54-468f-ac3e-7091a9a79584";

  React.useEffect(() => {
    const queryParams = `
      custom:(uuid,display)
     
    `.replace(/\s/g, "");

    fetch(
      `/openmrs/ws/rest/v1/encounter?v=full&patient=${props.patientUuid}&order=${order}&limit=${limit}&encounterType=${encType}`
    )
      .then(resp => {
        if (resp.ok) {
          response = resp.json();
          console.log(response);
          return response;
        } else {
          throw Error(
            `Cannot fetch visit ${props.patientUuid} - server responded with '${resp.status}'`
          );
        }
      })
      .then(vitals => {
        setVitals(vitals);
      });
  }, []);

  return vitals ? renderVitals() : renderLoader();

  function renderLoader() {
    return <div>Loading...</div>;
  }

  function renderVitals() {
    return (
      <table>
        {vitals.results[0].obs.map(v => (
          <div key={v.uuid}>
            <tr>{<td>{v.display} </td>}</tr>
          </div>
        ))}
      </table>
    );
  }

  function renderIdentifiers() {
    return vitals.identifiers
      .map(
        identifier =>
          `${identifier.identifierType.name}: ${identifier.identifier}`
      )
      .join(" - ");
  }
}

type VitalsInfoParcelProps = {
  visitUuid: string;
  patientUuid: string;
};

export default singleSpaReact({
  React,
  ReactDOM,
  rootComponent: VitalsInfoParcel,
  suppressComponentDidCatchWarning: true
});
