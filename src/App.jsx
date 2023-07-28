import React, { useRef } from 'react';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Users from './Collections/Users'; 



const styles = {
  receiptBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    boxShadow: '2px 2px 5px #888888',
  },
  actualReceipt: {
    padding: 10,
    flexGrow: 1,
    backgroundColor: 'grey'
  },
 
};
const App = () => {
  const [loader, setLoader] = useState(false);
  const refs = useRef(Users.map(() => ({ front: React.createRef(), back: React.createRef() })));

  const downloadPDF = async () => {
    let start = performance.now();
    try {
      setLoader(true);
      const doc = new jsPDF('p', 'mm', 'a4');

      for (let index = 0; index < Users.length; index++) {
        const { front, back } = refs.current[index];
        
        const frontCanvas = await html2canvas(front.current);
        const imgDataFront = frontCanvas.toDataURL('image/jpeg');

        const backCanvas = await html2canvas(back.current);
        const imgDataBack = backCanvas.toDataURL('image/jpeg');

        if (index > 0) {
          doc.addPage(); // Add a new page for the front side of subsequent users
        }
        doc.addImage(imgDataFront, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

        doc.addPage(); // Add a new page for the back side
        doc.addImage(imgDataBack, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
      }

      setLoader(false);
      doc.save('receipt.pdf');
      let timeTaken = performance.now() - start;
      console.log("Total time taken : " + timeTaken + " milliseconds");
      
    } catch (error) {
      console.error('Error while generating PDF:', error);
      setLoader(false);
    }
  };

  return (
    <div className="wrapper">
      {Users.map((user, index) => (
        <div className="receipt-box" key={user.id}>
          {/* Front side */}
          <div ref={refs.current[index].front} style={styles.actualReceipt}>
            <h1>{user.firstName}</h1> 
          </div>

          {/* Back side */}
          <div ref={refs.current[index].back} style={styles.actualReceipt}>
            <h1>{user.surname}</h1>
           
          </div>
        </div>
      ))}

      {/* Receipt action */}
      <div className="receipt-actions-div">
        <div style={styles.actionsRight}>
          <button
            className="receipt-modal-download-button"
            onClick={downloadPDF}
            disabled={loader}
          >
            {loader ? 'Downloading' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );

 
};

export default App;